import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildEmail, handleContact, validate } from '../src/contact.js'

const SITE = 'https://take-me.jp'
const env = {
  ALLOWED_ORIGINS: `${SITE}, http://localhost:3001`,
  TURNSTILE_SECRET_KEY: 'secret-key',
  TURNSTILE_HOSTNAMES: 'take-me.jp, www.take-me.jp',
  MAIL_FROM: 'contact@take-me.jp',
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
      sendMail: async (mail) => {
        if (mailError) throw mailError
        mails.push(mail)
      },
    },
  }
}

const decodeBody = (raw) => Buffer.from(raw.split('\r\n\r\n')[1].replace(/\r\n/g, ''), 'base64').toString('utf8')

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

test('e-mails the message, with the visitor as Reply-To', async () => {
  const { deps, mails } = setup()
  const response = await handleContact(post(message), env, deps)

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
  assert.equal(mails.length, 1)
  assert.equal(mails[0].from, 'contact@take-me.jp')
  assert.equal(mails[0].to, 'inbox@example.com')
  assert.match(mails[0].raw, /^Reply-To: "Ana" <ana@example\.com>\r$/m)
  assert.match(mails[0].raw, /^Subject: New message from Ana\r$/m)
  assert.match(decodeBody(mails[0].raw), /Hi Oscar!/)
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

test('encodes Japanese names and messages for the e-mail', () => {
  const name = 'ブレネス・オスカル・アンドレス・ブレネス・モンヘ・テスト'
  const { raw } = buildEmail(
    { name, email: 'oscar@example.jp', message: 'はじめまして。\nよろしくお願いします。', language: 'ja' },
    { from: 'contact@take-me.jp', to: 'inbox@example.com', date: new Date(Date.UTC(2026, 10, 11, 9, 30)), id: 'abc' }
  )
  const [head] = raw.split('\r\n\r\n')

  // Every header line is ASCII and RFC 2047 words stay within 75 characters
  assert.match(head, /^[\x20-\x7e\r\n]*$/)
  for (const word of head.match(/=\?UTF-8\?B\?[^?]*\?=/g)) assert.ok(word.length <= 75, word)

  const decodeWords = (line) =>
    line.replace(/\r\n /g, '').replace(/=\?UTF-8\?B\?([^?]*)\?=/g, (_, data) => Buffer.from(data, 'base64').toString('binary'))
  const subject = head.split('\r\n').findIndex((line) => line.startsWith('Subject:'))
  const subjectLines = head.split('\r\n').slice(subject).filter((line, index) => index === 0 || line.startsWith(' '))
  assert.equal(Buffer.from(decodeWords(subjectLines.join('\r\n')), 'binary').toString('utf8'), `Subject: New message from ${name}`)

  assert.match(head, /^Date: Wed, 11 Nov 2026 09:30:00 \+0000$/m)
  assert.match(head, /^Message-ID: <abc@take-me\.jp>$/m)
  assert.equal(decodeBody(raw).split('\r\n').slice(-5, -3).join('\n'), 'はじめまして。\nよろしくお願いします。')
  for (const line of raw.split('\r\n\r\n')[1].split('\r\n')) assert.ok(line.length <= 76)
})
