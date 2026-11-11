# Contact form endpoint

A Cloudflare Worker that receives the site's contact form (`src/components/contactme/ContactForm.js`):
it checks the fields, asks Cloudflare whether the Turnstile token is good, and e-mails the message
through Cloudflare Email Routing, with the visitor in `Reply-To` so answering is just replying.

The site is static (GitHub Pages) and a Turnstile token only protects anything once a server has
verified it, hence this Worker.

## Going live

1. **Turnstile.** The widget for `take-me.jp` exists and its site key is in `.env.production`. In
   the dashboard, check that its hostnames include every domain the site is served from: the
   Worker only accepts tokens whose hostname is in `TURNSTILE_HOSTNAMES` (`wrangler.toml`) and
   whose action is `contact`.
2. **Email Routing.** Turn it on for `take-me.jp` and add the address where messages should arrive
   as a destination address (Cloudflare e-mails a link to verify it).
3. **The Worker**, from this folder, with Wrangler 4 installed (`wrangler login` first). Each
   `secret put` asks for the value, so it never goes in a command or a file:

   ```bash
   wrangler secret put TURNSTILE_SECRET_KEY
   wrangler secret put MAIL_TO
   wrangler deploy
   ```

   The last command prints the Worker's URL, `https://take-me-contact.<subdomain>.workers.dev`.
4. **The site.** Put that URL in `REACT_APP_CONTACT_ENDPOINT`, in Vercel (Settings → Environment
   Variables, Production) or in `.env.production`, and deploy. Until it's set, the dialog shows the
   e-mail and LinkedIn instead of the form.
5. **Check it.** Send a message from the live site: it should arrive, and posting the same token
   again should get `403 verification` (tokens are single use).

If the domain's mail can't go through Email Routing, only `sendMail` in `src/index.js` changes: any
e-mail API called with `fetch` (Resend, Postmark…) does the same job.

## Trying it locally

- `npm start` in the site uses Cloudflare's test site key (`.env.development`), which always passes.
- `node workers/contact/dev-server.js` serves this same code on http://localhost:8787 with the
  matching test secret: Cloudflare really verifies the token, and the e-mail is printed in the
  terminal instead of sent. Test keys answer for `example.com` with no action, so the dev server
  turns on `TURNSTILE_TEST_MODE`; the deployed Worker never accepts them. In Claude Code's preview it's the `contact-api` configuration.
- `npm test` in this folder runs the tests (Node's own test runner, nothing to install).

## The request

`POST /` with JSON `{ name, email, message, language, "cf-turnstile-response" }`, from an origin listed in
`ALLOWED_ORIGINS` (`wrangler.toml`). The answer is `{ ok: true }` or `{ ok: false, error }`:

| error          | status | what happened                                                    |
| -------------- | ------ | ---------------------------------------------------------------- |
| `invalid`      | 400    | some fields are wrong, `fields` says which: `{ email: 'invalid' }` |
| `verification` | 403    | Turnstile didn't pass, or not for this action and hostname         |
| `send`         | 502    | Email Routing refused or failed                                   |
| `config`       | 500    | a setting or secret is missing (see the Worker's logs)            |

The field rules (required, lengths, e-mail format) are the same as in `src/utils/contactForm.js`:
change them in both places.
