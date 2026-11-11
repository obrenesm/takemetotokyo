# Contact form endpoint

A Cloudflare Worker that receives the site's contact form (`src/components/contactme/ContactForm.js`):
it checks the fields, asks Cloudflare whether the Turnstile token is good, and e-mails the message
through Resend, from `contact@mail.take-me.jp`, with the visitor in `Reply-To` so answering is just
replying. The e-mail's design is Resend's "Contact form message" template (alias
`contact-form-message`, its id is `RESEND_TEMPLATE_ID` in `wrangler.toml`): edit it in Resend, not here.

The site is static (GitHub Pages) and a Turnstile token only protects anything once a server has
verified it, hence this Worker.

## Going live

1. **Turnstile.** The widget for `take-me.jp` exists and its site key is in `.env.production`. In
   the dashboard, check that its hostnames include every domain the site is served from: the
   Worker only accepts tokens whose hostname is in `TURNSTILE_HOSTNAMES` (`wrangler.toml`) and
   whose action is `contact`.
2. **Resend domain.** `mail.take-me.jp` is created in Resend. Its DNS records go in **Vercel**, whose
   nameservers take-me.jp uses (not the registrar's DNS panel): open the domain in Resend and use
   **Auto configure**, then add DMARC if it's missing (`_dmarc.mail` TXT `v=DMARC1; p=none;`).
   Resend verifies it within minutes to hours; until then it rejects mail from that domain.
3. **Resend key.** Resend → API Keys → create one with **sending access** limited to
   `mail.take-me.jp`. The Worker never gets a full-access key.
4. **The Worker**, from this folder. Wrangler is a dev dependency here (`npm install` once, then
   `npx wrangler login`). Each `secret put` asks for the value, so it never goes in a command or a
   file:

   ```bash
   npx wrangler secret put TURNSTILE_SECRET_KEY
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put MAIL_TO
   npm run deploy
   ```

   The last command prints the Worker's URL, `https://take-me-contact.<subdomain>.workers.dev`.
5. **The site.** Put that URL in `REACT_APP_CONTACT_ENDPOINT`, in Vercel (Settings → Environment
   Variables, Production) or in `.env.production`, and deploy. Until it's set, the dialog shows the
   e-mail and LinkedIn instead of the form.
6. **Check it.** Send a message from the live site: it should reach `delivered` in Resend (Emails)
   and your inbox, and posting the same token again should get `403 verification`.

Each submission is sent with an idempotency key made from its (single use) Turnstile token, so a
retry never sends it twice. Network errors, `429` and `5xx` are retried twice; other `4xx` are not.

## Trying it locally

- `npm start` in the site uses Cloudflare's test site key (`.env.development`), which always passes.
- `node workers/contact/dev-server.js` serves this same code on http://localhost:8787 with the
  matching test secret: Cloudflare really verifies the token, and the e-mail is printed in the
  terminal instead of sent (the request it would send to Resend). Test keys answer for `example.com` with no action, so the dev server
  turns on `TURNSTILE_TEST_MODE`; the deployed Worker never accepts them. In Claude Code's preview it's the `contact-api` configuration.
- `npm test` in this folder runs the tests (Node's own test runner, nothing to install).

## The request

`POST /` with JSON `{ name, email, message, language, "cf-turnstile-response" }`, from an origin listed in
`ALLOWED_ORIGINS` (`wrangler.toml`). The answer is `{ ok: true }` or `{ ok: false, error }`:

| error          | status | what happened                                                    |
| -------------- | ------ | ---------------------------------------------------------------- |
| `invalid`      | 400    | some fields are wrong, `fields` says which: `{ email: 'invalid' }` |
| `verification` | 403    | Turnstile didn't pass, or not for this action and hostname         |
| `send`         | 502    | Resend refused it or kept failing (see the Worker's logs)         |
| `config`       | 500    | a setting or secret is missing (see the Worker's logs)            |

The field rules (required, lengths, e-mail format) are the same as in `src/utils/contactForm.js`:
change them in both places.
