import { EmailMessage } from 'cloudflare:email'
import { handleContact } from './contact.js'

// The Worker: the e-mail goes out through the MAILER binding (Email Routing, see wrangler.toml)
export default {
  fetch(request, env) {
    return handleContact(request, env, {
      sendMail: ({ from, to, raw }) => env.MAILER.send(new EmailMessage(from, to, raw)),
    })
  },
}
