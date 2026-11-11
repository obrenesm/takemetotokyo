# Contact form endpoint

A Cloudflare Worker that receives the site's contact form (`src/components/contactme/ContactForm.js`):
it checks the fields, asks Cloudflare whether the Turnstile token is good, and e-mails the message
through Cloudflare Email Routing, with the visitor in `Reply-To` so answering is just replying.

The site is static (GitHub Pages) and a Turnstile token only protects anything once a server has
verified it, hence this Worker.

## Going live

1. **Turnstile.** Cloudflare dashboard → Turnstile → Add widget, hostname `take-me.jp`, mode
   Managed. Keep the site key (public) and the secret key.
2. **Email Routing.** Turn it on for `take-me.jp` and add the address where messages should arrive
   as a destination address (Cloudflare e-mails a link to verify it).
3. **The Worker**, from this folder:

   ```bash
   npx wrangler login
   npx wrangler secret put TURNSTILE_SECRET_KEY
   npx wrangler secret put MAIL_TO
   npx wrangler deploy
   ```

   The last command prints the Worker's URL, `https://take-me-contact.<subdomain>.workers.dev`.
4. **The site.** Put the site key and that URL in `.env.production`, then deploy as usual
   (`npm run deploy`). Until both are set, the dialog shows the e-mail and LinkedIn instead of the form.

If the domain's mail can't go through Email Routing, only `sendMail` in `src/index.js` changes: any
e-mail API called with `fetch` (Resend, Postmark…) does the same job.

## Trying it locally

- `npm start` in the site uses Cloudflare's test site key (`.env.development`), which always passes.
- `node workers/contact/dev-server.js` serves this same code on http://localhost:8787 with the
  matching test secret: Cloudflare really verifies the token, and the e-mail is printed in the
  terminal instead of sent. In Claude Code's preview it's the `contact-api` configuration.
- `npm test` in this folder runs the tests (Node's own test runner, nothing to install).

## The request

`POST /` with JSON `{ name, email, message, language, token }`, from an origin listed in
`ALLOWED_ORIGINS` (`wrangler.toml`). The answer is `{ ok: true }` or `{ ok: false, error }`:

| error          | status | what happened                                                    |
| -------------- | ------ | ---------------------------------------------------------------- |
| `invalid`      | 400    | some fields are wrong, `fields` says which: `{ email: 'invalid' }` |
| `verification` | 403    | Turnstile didn't pass (the site renders a new widget)              |
| `send`         | 502    | Email Routing refused or failed                                   |
| `config`       | 500    | a setting or secret is missing (see the Worker's logs)            |

The field rules (required, lengths, e-mail format) are the same as in `src/utils/contactForm.js`:
change them in both places.
