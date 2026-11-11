// The contact endpoint on this machine, for `npm start` in the site: the Worker's own code, but the
// request it would send to Resend is printed here instead. Turnstile is checked for real, with Cloudflare's test
// secret that accepts the tokens of the test site key in .env.development.
//   node workers/contact/dev-server.js       (port 8787, or PORT=...)
import { createServer } from 'node:http'
import { handleContact } from './src/contact.js'

const port = Number(process.env.PORT) || 8787

const env = {
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA',
  // What Cloudflare's test keys answer (they have no action); never in production
  TURNSTILE_HOSTNAMES: process.env.TURNSTILE_HOSTNAMES || 'example.com',
  TURNSTILE_TEST_MODE: 'true',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001',
  // Nothing reaches Resend from here: sendMail below prints the request instead
  RESEND_API_KEY: 'not-used-locally',
  RESEND_TEMPLATE_ID: 'contact-form-message',
  MAIL_TO: 'inbox@example.com',
}

async function sendMail(email, idempotencyKey) {
  console.log(`\n----- Resend request (not sent) -----\nIdempotency-Key: ${idempotencyKey}\n${JSON.stringify(email, null, 2)}\n-------------------------------------\n`)
  return 'local-test'
}

// Headers Node's Request won't take, or that don't mean anything past this hop
const SKIP = new Set(['host', 'connection', 'content-length', 'transfer-encoding', 'keep-alive'])

createServer(async (req, res) => {
  try {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)

    const headers = Object.entries(req.headers)
      .filter(([name]) => !SKIP.has(name))
      .flatMap(([name, value]) => (Array.isArray(value) ? value.map((each) => [name, each]) : [[name, value]]))

    const request = new Request(`http://localhost:${port}${req.url}`, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
    })

    const response = await handleContact(request, env, { sendMail })
    res.writeHead(response.status, Object.fromEntries(response.headers))
    res.end(Buffer.from(await response.arrayBuffer()))
    console.log(`${req.method} ${req.url} -> ${response.status}`)
  } catch (error) {
    console.error(error)
    res.writeHead(500).end()
  }
}).listen(port, () => console.log(`Contact endpoint on http://localhost:${port}/`))
