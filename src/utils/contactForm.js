// The contact form: where it sends, its rules and the request. The Worker that receives it
// (workers/contact/src/contact.js) checks the same rules again, keep both in step.

export const CONTACT_EMAIL = 'oscar@take-me.jp'
export const CONTACT_FIELDS = ['name', 'email', 'message']
export const CONTACT_LIMITS = { name: 100, email: 254, message: 5000 }

// Something@something.tld: catches typos without rejecting unusual but valid addresses
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/

// Set at build time (.env.development / .env.production). Without both, the dialog shows the
// e-mail and LinkedIn only, so a build never ships a form that can't send.
export function getContactConfig() {
  const endpoint = process.env.REACT_APP_CONTACT_ENDPOINT || ''
  const siteKey = process.env.REACT_APP_TURNSTILE_SITE_KEY || ''
  return { endpoint, siteKey, enabled: Boolean(endpoint && siteKey) }
}

export function normalizeContact({ name = '', email = '', message = '' }) {
  return { name: name.trim(), email: email.trim(), message: message.trim() }
}

// { field: 'required' | 'invalid' | 'tooLong' } for every field with a problem, {} when it's fine
export function validateContact(values) {
  const { name, email, message } = normalizeContact(values)
  const errors = {}

  if (!name) errors.name = 'required'
  else if (name.length > CONTACT_LIMITS.name) errors.name = 'tooLong'

  if (!email) errors.email = 'required'
  else if (email.length > CONTACT_LIMITS.email) errors.email = 'tooLong'
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'invalid'

  if (!message) errors.message = 'required'
  else if (message.length > CONTACT_LIMITS.message) errors.message = 'tooLong'

  return errors
}

// Resolves to { ok: true } or { ok: false, error } where error is
//   'invalid'      the server didn't accept some fields (they come in `fields`)
//   'verification' the Turnstile token didn't pass
//   'failed'       anything else: network, timeout, server down
export async function sendContactMessage(endpoint, payload, { timeout = 15000 } = {}) {
  const controller = typeof AbortController === 'function' ? new AbortController() : null
  const timer = controller && setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller?.signal,
    })
    const body = await response.json().catch(() => ({}))

    if (response.ok && body.ok !== false) return { ok: true }
    if (body.error === 'invalid' && body.fields) return { ok: false, error: 'invalid', fields: body.fields }
    if (body.error === 'verification') return { ok: false, error: 'verification' }
    return { ok: false, error: 'failed' }
  } catch (error) {
    return { ok: false, error: 'failed' }
  } finally {
    if (timer) clearTimeout(timer)
  }
}
