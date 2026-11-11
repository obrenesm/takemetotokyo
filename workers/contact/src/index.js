import { handleContact } from './contact.js'

// The Worker: the e-mail goes out through Resend (RESEND_API_KEY and RESEND_TEMPLATE_ID, see wrangler.toml)
export default {
  fetch(request, env) {
    return handleContact(request, env)
  },
}
