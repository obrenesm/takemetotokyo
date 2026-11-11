// The contact form's endpoint: checks the fields and the Turnstile token, then e-mails the message
// through Resend. The field rules are the site's (src/utils/contactForm.js), keep both in step.
// Runs as a Cloudflare Worker (src/index.js) and on Node for the tests and local development
// (dev-server.js), so it only uses what both have: fetch, Request, Response, FormData, crypto.
// Resend is called through its REST API: an SDK would be the Worker's only dependency.

export const LIMITS = { name: 100, email: 254, message: 5000 }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/
const LANGUAGES = ['en', 'ja']
const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const MAX_BODY = 32 * 1024
const MAX_TOKEN = 2048
const SITEVERIFY_TIMEOUT = 5000
// The action the site's widget renders with (src/components/contactme/Turnstile.js)
export const TURNSTILE_ACTION = 'contact'
// The field the site sends the token in, Turnstile's usual name
export const TOKEN_FIELD = 'cf-turnstile-response'
const SETTINGS = ['TURNSTILE_SECRET_KEY', 'TURNSTILE_HOSTNAMES', 'RESEND_API_KEY', 'RESEND_TEMPLATE_ID', 'MAIL_TO']
const SECRET_KEYS = ['TURNSTILE_SECRET_KEY', 'RESEND_API_KEY']

const list = (value) => (value || '').split(',').map((item) => item.trim()).filter(Boolean)

// Control characters out of one-line fields: a line break in the name could add e-mail headers
const oneLine = (value) =>
  typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim() : ''

// The message keeps its line breaks and tabs
const multiLine = (value) =>
  typeof value === 'string'
    ? value.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b-\u001f\u007f]+/g, '').trim()
    : ''

export function validate(input) {
  const values = {
    name: oneLine(input.name),
    email: oneLine(input.email),
    message: multiLine(input.message),
    language: LANGUAGES.includes(input.language) ? input.language : 'unknown',
  }
  const errors = {}

  if (!values.name) errors.name = 'required'
  else if (values.name.length > LIMITS.name) errors.name = 'tooLong'

  if (!values.email) errors.email = 'required'
  else if (values.email.length > LIMITS.email) errors.email = 'tooLong'
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = 'invalid'

  if (!values.message) errors.message = 'required'
  else if (values.message.length > LIMITS.message) errors.message = 'tooLong'

  return { values, errors }
}

// Asks Cloudflare whether the token is good. Each token can be checked only once. It passes only
// with success, the site's action and a hostname from the allowlist (TURNSTILE_HOSTNAMES).
// Cloudflare's test keys answer for example.com with no action: they're accepted only with
// TURNSTILE_TEST_MODE=true, which only the local dev server sets.
export async function verifyTurnstile(token, { secret, ip, hostnames, testMode = false, fetch: fetchImpl = fetch }) {
  if (typeof token !== 'string' || !token || token.length > MAX_TOKEN) return false

  const body = new FormData()
  body.append('secret', secret)
  body.append('response', token)
  if (ip) body.append('remoteip', ip)

  try {
    const response = await fetchImpl(SITEVERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(SITEVERIFY_TIMEOUT),
    })
    const outcome = await response.json()
    const testing = outcome.metadata?.result_with_testing_key === true
    const reason =
      outcome.success !== true ? `failed (${(outcome['error-codes'] || []).join(', ') || 'no error codes'})`
      : !hostnames.includes(outcome.hostname) ? `hostname ${outcome.hostname} isn't allowed`
      : testing ? (testMode ? null : 'test key outside test mode')
      : outcome.action !== TURNSTILE_ACTION ? `action ${outcome.action} isn't ${TURNSTILE_ACTION}`
      : null

    // Why a token was turned away, for the Worker's logs (never the token or the secret)
    if (reason) console.warn(`Turnstile rejected the token: ${reason}`)
    return !reason
  } catch (error) {
    // Network error, timeout or an answer that isn't JSON
    console.warn(`Turnstile check didn't complete: ${error.name}`)
    return false
  }
}

// THE E-MAIL: Resend's "Contact form message" template (its HTML lives in Resend, RESEND_TEMPLATE_ID),
// from contact@mail.take-me.jp, with the visitor in Reply-To so answering is just replying

const RESEND_URL = 'https://api.resend.com/emails'
const RESEND_TIMEOUT = 10000
const RESEND_RETRIES = 2

// The template drops values in as they are, and they come from strangers: escaped, nobody can
// slip links or markup into the e-mail. Line breaks become <br> (Resend writes the text part
// from the HTML, decoding the entities again)
const escapeHtml = (text) =>
  text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])

export function buildEmail({ name, email, message, language }, { to, templateId }) {
  return {
    to: [to],
    reply_to: email,
    // Plain text, not HTML: the raw name (it went through oneLine, so no line breaks)
    subject: `New message from ${name}`,
    template: {
      id: templateId,
      variables: {
        VISITOR_NAME: escapeHtml(name),
        VISITOR_EMAIL: escapeHtml(email),
        MESSAGE: escapeHtml(message).replace(/\n/g, '<br>'),
        SITE_LANGUAGE: language,
      },
    },
  }
}

// One key per form submission: the Turnstile token is single use, so its hash names the
// submission. A retry with the same key never sends a second e-mail
export async function idempotencyKey(token) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))
  const hex = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
  return `contact-form/${hex}`
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Sends through Resend's API and resolves to the e-mail's id. Network errors, 429 and 5xx are
// retried (waiting what retry-after says, at most 5 s); any other 4xx is a mistake to fix, not
// to repeat, so it throws right away
export async function sendWithResend(email, { apiKey, idempotencyKey: key, fetch: fetchImpl = fetch, retries = RESEND_RETRIES, delay = wait }) {
  for (let attempt = 0; ; attempt += 1) {
    let response
    try {
      response = await fetchImpl(RESEND_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': key,
        },
        body: JSON.stringify(email),
        signal: AbortSignal.timeout(RESEND_TIMEOUT),
      })
    } catch (error) {
      if (attempt >= retries) throw error
      await delay(500 * 2 ** attempt)
      continue
    }

    const body = await response.json().catch(() => ({}))
    if (response.ok && body.id) return body.id

    const retryable = response.status === 429 || response.status >= 500
    if (!retryable || attempt >= retries) {
      throw new Error(`Resend answered ${response.status}: ${body.name || ''} ${body.message || ''}`.trim())
    }
    const retryAfter = Number(response.headers.get('retry-after'))
    await delay(Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter, 5) * 1000 : 500 * 2 ** attempt)
  }
}

// THE REQUEST

const json = (body, status, headers) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
  })

function corsHeaders(origin, allowed) {
  if (!origin || !allowed.includes(origin)) return { Vary: 'Origin' }

  return {
    Vary: 'Origin',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

// Answers { ok: true } or { ok: false, error }, plus `fields` ({ name: 'required', ... }) when the
// error is 'invalid'. The site shows its own text for 'invalid' and 'verification', and a generic
// "couldn't be sent" for the rest.
//   sendMail(email, key)  delivers the e-mail, Resend by default (dev-server.js prints it instead)
//   fetch                 for the Turnstile check and Resend (tests pass a fake one)
export async function handleContact(request, env, { sendMail, fetch: fetchImpl } = {}) {
  const allowed = list(env.ALLOWED_ORIGINS)
  const origin = request.headers.get('Origin')
  const cors = corsHeaders(origin, allowed)

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
  if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405, { ...cors, Allow: 'POST, OPTIONS' })

  // Only the site's pages (browsers always send Origin with a POST like this one)
  if (!origin || !allowed.includes(origin)) return json({ ok: false, error: 'origin' }, 403, cors)

  const missing = SETTINGS.filter((name) => !env[name])
  if (missing.length) {
    console.error(`The contact endpoint is missing settings: ${missing.join(', ')}`)
    return json({ ok: false, error: 'config' }, 500, cors)
  }

  // Keys are plain ASCII. A key copied with look-alike letters (Cyrillic Р for P, say) would be
  // rejected anyway, and the runtime's warning about the header would print it in the logs
  const garbled = SECRET_KEYS.filter((name) => !/^[\x21-\x7e]+$/.test(env[name]))
  if (garbled.length) {
    console.error(`These secrets have characters a key can't have, set them again: ${garbled.join(', ')}`)
    return json({ ok: false, error: 'config' }, 500, cors)
  }

  if (!(request.headers.get('Content-Type') || '').startsWith('application/json')) {
    return json({ ok: false, error: 'type' }, 415, cors)
  }
  if (Number(request.headers.get('Content-Length')) > MAX_BODY) return json({ ok: false, error: 'size' }, 413, cors)

  let input
  try {
    const text = await request.text()
    if (text.length > MAX_BODY) return json({ ok: false, error: 'size' }, 413, cors)
    input = JSON.parse(text)
  } catch (error) {
    return json({ ok: false, error: 'json' }, 400, cors)
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return json({ ok: false, error: 'json' }, 400, cors)

  // Fields first: a form with mistakes doesn't use up its Turnstile token
  const { values, errors } = validate(input)
  if (Object.keys(errors).length) return json({ ok: false, error: 'invalid', fields: errors }, 400, cors)

  const verified = await verifyTurnstile(input[TOKEN_FIELD], {
    secret: env.TURNSTILE_SECRET_KEY,
    ip: request.headers.get('CF-Connecting-IP'),
    hostnames: list(env.TURNSTILE_HOSTNAMES),
    testMode: env.TURNSTILE_TEST_MODE === 'true',
    fetch: fetchImpl,
  })
  if (!verified) return json({ ok: false, error: 'verification' }, 403, cors)

  const email = buildEmail(values, { to: env.MAIL_TO, templateId: env.RESEND_TEMPLATE_ID })
  const key = await idempotencyKey(input[TOKEN_FIELD])
  const deliver =
    sendMail || ((message, idempotency) =>
      sendWithResend(message, { apiKey: env.RESEND_API_KEY, idempotencyKey: idempotency, fetch: fetchImpl }))

  try {
    const id = await deliver(email, key)
    console.log(`Contact e-mail sent: ${id}`)
  } catch (error) {
    console.error('The contact e-mail could not be sent:', error)
    return json({ ok: false, error: 'send' }, 502, cors)
  }

  return json({ ok: true }, 200, cors)
}
