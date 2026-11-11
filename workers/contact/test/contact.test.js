import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildEmail, handleContact, idempotencyKey, sendWithResend, validate } from '../src/contact.js'

const SITE = 'https://take-me.jp'
const env = {
  ALLOWED_ORIGINS: `${SITE}, http://localhost:3001`,
  TURNSTILE_SECRET_KEY: 'secret-key',
  TURNSTILE_HOSTNAMES: 'take-me.jp, www.take-me.jp',
  RESEND_API_KEY: 're_test_key',
  RESEND_TEMPLATE_ID: 'template-id',
  MAIL_TO: 'inbox@example.com',
}
const message = {
  name: 'Ana',
  email: 'ana@example.com',
  message: 'Hi Oscar!',
  language: 'en',
  'cf-turnstile-response': 'turnstile-token',
}

function post(body, { origin = SITE, type = 'application/json' } = {}) {
  const headers = { 'Content-Type': type, 'CF-Connecting-IP': '203.0.113.7' }
  if (origin) headers.Origin = origin
  return new Request('https://contact.example/', {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

// A fake Turnstile check that records what it was asked, and a fake mailbox. `outcome` is what
// siteverify answers: by default a pass for the site's action and hostname
function setup({ outcome = { success: true, action: 'contact', hostname: 'take-me.jp' }, mailError = null } = {}) {
  const checks = []
  const mails = []
  return {
    checks,
    mails,
    deps: {
      fetch: async (url, init) => {
        checks.push({ url, form: Object.fromEntries(init.body) })
        return new Response(JSON.stringify(outcome))
      },
      sendMail: async (mail, key) => {
        if (mailError) throw mailError
        mails.push({ ...mail, key })
        return 'email-id'
      },
    },
  }
}

test('validate trims the fields and reports each problem', () => {
  assert.deepEqual(validate({ name: '  Ana ', email: ' ana@example.com ', message: ' Hi ' }).values, {
    name: 'Ana',
    email: 'ana@example.com',
    message: 'Hi',
    language: 'unknown',
  })
  assert.deepEqual(validate({}).errors, { name: 'required', email: 'required', message: 'required' })
  assert.deepEqual(validate({ name: 'Ana', email: 'ana@example', message: 'Hi' }).errors, { email: 'invalid' })
  assert.deepEqual(validate({ name: 'A'.repeat(101), email: 'a@b.co', message: 'x'.repeat(5001) }).errors, {
    name: 'tooLong',
    message: 'tooLong',
  })
  // A line break in the name could have added e-mail headers
  assert.equal(validate({ name: 'Ana\r\nBcc: x@example.com' }).values.name, 'Ana Bcc: x@example.com')
})

test('answers the preflight for the site, and only for the site', async () => {
  const preflight = (origin) =>
    handleContact(new Request('https://contact.example/', { method: 'OPTIONS', headers: { Origin: origin } }), env)

  const allowed = await preflight(SITE)
  assert.equal(allowed.status, 204)
  assert.equal(allowed.headers.get('Access-Control-Allow-Origin'), SITE)
  assert.match(allowed.headers.get('Access-Control-Allow-Headers'), /Content-Type/)

  const other = await preflight('https://elsewhere.example')
  assert.equal(other.headers.get('Access-Control-Allow-Origin'), null)
})

test('turns away other origins, other methods and other content types', async () => {
  const { deps, mails } = setup()

  assert.equal((await handleContact(post(message, { origin: 'https://elsewhere.example' }), env, deps)).status, 403)
  assert.equal((await handleContact(post(message, { origin: null }), env, deps)).status, 403)
  assert.equal((await handleContact(new Request(SITE, { headers: { Origin: SITE } }), env, deps)).status, 405)
  assert.equal((await handleContact(post('name=Ana', { type: 'application/x-www-form-urlencoded' }), env, deps)).status, 415)
  assert.equal((await handleContact(post('{not json'), env, deps)).status, 400)
  assert.equal(mails.length, 0)
})

test('sends back the fields with problems, without spending the token', async () => {
  const { deps, checks, mails } = setup()
  const response = await handleContact(post({ ...message, email: 'ana@', message: ' ' }), env, deps)

  assert.equal(response.status, 400)
  assert.deepEqual(await response.json(), { ok: false, error: 'invalid', fields: { email: 'invalid', message: 'required' } })
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), SITE)
  assert.equal(checks.length, 0)
  assert.equal(mails.length, 0)
})

test('does not send when the Turnstile check fails', async () => {
  const { deps, checks, mails } = setup({ outcome: { success: false, 'error-codes': ['invalid-input-response'] } })
  const response = await handleContact(post(message), env, deps)

  assert.equal(response.status, 403)
  assert.deepEqual(await response.json(), { ok: false, error: 'verification' })
  assert.deepEqual(checks[0].form, { secret: 'secret-key', response: 'turnstile-token', remoteip: '203.0.113.7' })
  assert.equal(mails.length, 0)
})

test('a missing token fails the check without asking Cloudflare', async () => {
  const { deps, checks } = setup()
  const { 'cf-turnstile-response': token, ...withoutToken } = message
  const response = await handleContact(post(withoutToken), env, deps)

  assert.equal(response.status, 403)
  assert.equal(checks.length, 0)
})

test('a passing token for another action or hostname is turned away', async () => {
  for (const outcome of [
    { success: true, action: 'login', hostname: 'take-me.jp' },
    { success: true, action: 'contact', hostname: 'elsewhere.example' },
    { success: true, hostname: 'take-me.jp' },
  ]) {
    const { deps, mails } = setup({ outcome })
    const response = await handleContact(post(message), env, deps)
    assert.equal(response.status, 403, JSON.stringify(outcome))
    assert.equal(mails.length, 0)
  }
})

test("Cloudflare's test keys only pass in test mode (the local dev server)", async () => {
  const outcome = { success: true, hostname: 'example.com', metadata: { result_with_testing_key: true } }
  const testEnv = { ...env, TURNSTILE_HOSTNAMES: 'example.com' }

  assert.equal((await handleContact(post(message), testEnv, setup({ outcome }).deps)).status, 403)
  assert.equal(
    (await handleContact(post(message), { ...testEnv, TURNSTILE_TEST_MODE: 'true' }, setup({ outcome }).deps)).status,
    200
  )
})

test('a Turnstile check that hangs or breaks fails closed', async () => {
  const { deps, mails } = setup()
  deps.fetch = async () => new Response('<html>Bad gateway</html>', { status: 502 })
  assert.equal((await handleContact(post(message), env, deps)).status, 403)
  assert.equal(mails.length, 0)
})

test('e-mails the message with the template, the visitor as Reply-To', async () => {
  const { deps, mails } = setup()
  const originalLog = console.log
  console.log = () => {}
  try {
    const response = await handleContact(post(message), env, deps)
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { ok: true })
  } finally {
    console.log = originalLog
  }

  assert.equal(mails.length, 1)
  const { key, ...mail } = mails[0]
  assert.deepEqual(mail, {
    to: ['inbox@example.com'],
    reply_to: 'ana@example.com',
    subject: 'New message from Ana',
    template: {
      id: 'template-id',
      variables: { VISITOR_NAME: 'Ana', VISITOR_EMAIL: 'ana@example.com', MESSAGE: 'Hi Oscar!', SITE_LANGUAGE: 'en' },
    },
  })
  assert.equal(key, await idempotencyKey('turnstile-token'))
})

test('escapes what visitors type, so nothing turns into markup in the e-mail', () => {
  const email = buildEmail(
    { name: 'Ana <b>', email: 'ana@example.com', message: 'Hi & <a href="x">click</a>\n\nはじめまして', language: 'ja' },
    { to: 'inbox@example.com', templateId: 'template-id' }
  )
  assert.equal(email.template.variables.VISITOR_NAME, 'Ana &lt;b&gt;')
  assert.equal(email.template.variables.MESSAGE, 'Hi &amp; &lt;a href=&quot;x&quot;&gt;click&lt;/a&gt;<br><br>はじめまして')
  // The subject is plain text: as typed
  assert.equal(email.subject, 'New message from Ana <b>')
})

test('one idempotency key per submission', async () => {
  const key = await idempotencyKey('token-a')
  assert.match(key, /^contact-form\/[0-9a-f]{64}$/)
  assert.equal(await idempotencyKey('token-a'), key)
  assert.notEqual(await idempotencyKey('token-b'), key)
})

// A fake Resend that answers with the given responses, one per call
function fakeResend(...answers) {
  const calls = []
  return {
    calls,
    fetch: async (url, init) => {
      calls.push({ url, init })
      const answer = answers[calls.length - 1]
      if (answer instanceof Error) throw answer
      return new Response(JSON.stringify(answer.body), { status: answer.status, headers: answer.headers })
    },
  }
}
const noWait = async () => {}

test('sends to Resend with the key and the idempotency key', async () => {
  const resend = fakeResend({ status: 200, body: { id: 'email-1' } })
  const id = await sendWithResend({ to: ['a@b.co'] }, { apiKey: 're_key', idempotencyKey: 'k1', fetch: resend.fetch, delay: noWait })

  assert.equal(id, 'email-1')
  assert.equal(resend.calls[0].url, 'https://api.resend.com/emails')
  assert.equal(resend.calls[0].init.headers.Authorization, 'Bearer re_key')
  assert.equal(resend.calls[0].init.headers['Idempotency-Key'], 'k1')
  assert.deepEqual(JSON.parse(resend.calls[0].init.body), { to: ['a@b.co'] })
})

test('retries network errors, 429 and 5xx with the same idempotency key', async () => {
  const waits = []
  const resend = fakeResend(
    new TypeError('network'),
    { status: 429, body: { name: 'rate_limit_exceeded' }, headers: { 'retry-after': '2' } },
    { status: 200, body: { id: 'email-2' } }
  )
  const id = await sendWithResend({}, { apiKey: 'k', idempotencyKey: 'same', fetch: resend.fetch, delay: async (ms) => waits.push(ms) })

  assert.equal(id, 'email-2')
  assert.equal(resend.calls.length, 3)
  assert.ok(resend.calls.every((call) => call.init.headers['Idempotency-Key'] === 'same'))
  assert.deepEqual(waits, [500, 2000])
})

test('does not retry other 4xx, and gives up after the retries', async () => {
  const invalid = fakeResend({ status: 422, body: { name: 'validation_error', message: 'Missing variable' } })
  await assert.rejects(
    sendWithResend({}, { apiKey: 'k', idempotencyKey: 'x', fetch: invalid.fetch, delay: noWait }),
    /422: validation_error Missing variable/
  )
  assert.equal(invalid.calls.length, 1)

  const down = fakeResend({ status: 503, body: {} }, { status: 503, body: {} }, { status: 503, body: {} })
  await assert.rejects(sendWithResend({}, { apiKey: 'k', idempotencyKey: 'x', fetch: down.fetch, delay: noWait }), /503/)
  assert.equal(down.calls.length, 3)
})

test('reports when the e-mail could not be sent', async () => {
  const { deps } = setup({ mailError: new Error('destination not verified') })
  const originalError = console.error
  console.error = () => {}
  try {
    const response = await handleContact(post(message), env, deps)
    assert.equal(response.status, 502)
    assert.deepEqual(await response.json(), { ok: false, error: 'send' })
  } finally {
    console.error = originalError
  }
})

test('refuses to run without its settings', async () => {
  const { deps } = setup()
  const originalError = console.error
  console.error = () => {}
  try {
    const response = await handleContact(post(message), { ...env, MAIL_TO: '' }, deps)
    assert.equal(response.status, 500)
  } finally {
    console.error = originalError
  }
})

test('refuses a key with non-ASCII look-alikes, without logging it or asking anyone', async () => {
  const { deps, checks, mails } = setup()
  const logged = []
  const originalError = console.error
  console.error = (...args) => logged.push(args.join(' '))
  try {
    // A Cyrillic Р where a Latin P belongs
    const response = await handleContact(post(message), { ...env, RESEND_API_KEY: 're_test_Рkey' }, deps)
    assert.equal(response.status, 500)
    assert.deepEqual(await response.json(), { ok: false, error: 'config' })
    assert.equal(checks.length, 0)
    assert.equal(mails.length, 0)
    assert.match(logged.join('\n'), /RESEND_API_KEY/)
    assert.doesNotMatch(logged.join('\n'), /re_test/)
  } finally {
    console.error = originalError
  }
})
