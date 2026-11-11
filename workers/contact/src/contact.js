// The contact form's endpoint: checks the fields and the Turnstile token, then e-mails the message.
// The field rules are the site's (src/utils/contactForm.js), keep both in step.
// Runs as a Cloudflare Worker (src/index.js) and on Node for the tests and local development
// (dev-server.js), so it only uses what both have: fetch, Request, Response, FormData, crypto.

export const LIMITS = { name: 100, email: 254, message: 5000 }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/
const LANGUAGES = ['en', 'ja']
const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const MAX_BODY = 32 * 1024
const MAX_TOKEN = 2048
const SETTINGS = ['TURNSTILE_SECRET_KEY', 'MAIL_FROM', 'MAIL_TO']

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

// Asks Cloudflare whether the token is good. Each token can be checked only once
export async function verifyTurnstile(token, { secret, ip, fetch: fetchImpl = fetch }) {
  if (typeof token !== 'string' || !token || token.length > MAX_TOKEN) return false

  const body = new FormData()
  body.append('secret', secret)
  body.append('response', token)
  if (ip) body.append('remoteip', ip)

  try {
    const response = await fetchImpl(SITEVERIFY_URL, { method: 'POST', body })
    const outcome = await response.json()
    return outcome.success === true
  } catch (error) {
    return false
  }
}

// THE E-MAIL: plain text in UTF-8, the visitor in Reply-To so answering is just replying

const isPlainAscii = (text) => /^[\x20-\x7e]*$/.test(text)

function base64(text) {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return btoa(binary)
}

// Non-ASCII header text as RFC 2047 words (=?UTF-8?B?...?=): at most 75 characters each, and a
// character's bytes never split between two words
function encodeHeaderText(text) {
  if (isPlainAscii(text)) return text

  const encoder = new TextEncoder()
  const words = []
  let word = ''
  for (const char of text) {
    if (word && encoder.encode(word + char).length > 45) {
      words.push(word)
      word = ''
    }
    word += char
  }
  if (word) words.push(word)

  return words.map((part) => `=?UTF-8?B?${base64(part)}?=`).join('\r\n ')
}

function formatAddress(name, address) {
  const display = isPlainAscii(name) ? `"${name.replace(/["\\]/g, '\\$&')}"` : encodeHeaderText(name)
  return `${display} <${address}>`
}

export function buildEmail({ name, email, message, language }, { from, to, date = new Date(), id = crypto.randomUUID() }) {
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Site language: ${language}`,
    '',
    message,
    '',
    '--',
    `Sent with the contact form on take-me.jp. Reply to this e-mail to write back to ${name}.`,
  ].join('\n')

  const headers = [
    `From: ${formatAddress('take-me.jp', from)}`,
    `To: <${to}>`,
    `Reply-To: ${formatAddress(name, email)}`,
    `Subject: ${encodeHeaderText(`New message from ${name}`)}`,
    `Date: ${date.toUTCString().replace(/GMT$/, '+0000')}`,
    `Message-ID: <${id}@${from.split('@')[1]}>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
  ]

  // Base64 lines of 76 characters at most
  const encodedBody = base64(body.replace(/\n/g, '\r\n')).replace(/.{76}(?=.)/g, '$&\r\n')

  return { from, to, raw: `${headers.join('\r\n')}\r\n\r\n${encodedBody}\r\n` }
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
//   sendMail({ from, to, raw })  delivers the e-mail (Email Routing on Cloudflare, a log on Node)
//   fetch                         for the Turnstile check (tests pass a fake one)
export async function handleContact(request, env, { sendMail, fetch: fetchImpl } = {}) {
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean)
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

  const verified = await verifyTurnstile(input.token, {
    secret: env.TURNSTILE_SECRET_KEY,
    ip: request.headers.get('CF-Connecting-IP'),
    fetch: fetchImpl,
  })
  if (!verified) return json({ ok: false, error: 'verification' }, 403, cors)

  try {
    await sendMail(buildEmail(values, { from: env.MAIL_FROM, to: env.MAIL_TO }))
  } catch (error) {
    console.error('The contact e-mail could not be sent:', error)
    return json({ ok: false, error: 'send' }, 502, cors)
  }

  return json({ ok: true }, 200, cors)
}
