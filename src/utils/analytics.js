// Visits and a few events, counted by Umami Cloud (cloud.umami.is). No cookies, nothing personal.
// Umami's script counts each page on its own, also the routes changed without a reload (/journey,
// /credits). The contact dialog has no address of its own, so it's counted here as the page
// /contact (trackPageView), next to / and /journey in Umami's Pages list. Events go through
// trackEvent.
//
// The website ID is set at build time (.env.production). Without it (npm start, tests) nothing
// loads and nothing is sent. ANALYTICS_DOMAIN keeps Vercel's preview deployments and localhost out
// of the numbers even when a build has the ID.
//
// exclude-search: the address is counted without its ?query. The journey's filters change it
// (?show=...) and each change would otherwise count as one more visit to /journey.

const SCRIPT_URL = 'https://cloud.umami.is/script.js'
const ANALYTICS_DOMAIN = 'take-me.jp'

export function loadAnalytics() {
  const websiteId = process.env.REACT_APP_UMAMI_WEBSITE_ID
  if (!websiteId || document.querySelector(`script[src="${SCRIPT_URL}"]`)) return

  const script = document.createElement('script')
  script.src = SCRIPT_URL
  script.defer = true
  script.dataset.websiteId = websiteId
  script.dataset.domains = ANALYTICS_DOMAIN
  script.dataset.excludeSearch = 'true'
  document.head.appendChild(script)
}

// Lost if the script hasn't arrived yet (or is blocked): counting must never break the page
function send(...args) {
  try {
    window.umami?.track(...args)
  } catch (error) {
    // Nothing to do: a missed count isn't worth an error
  }
}

// A view of something that has no address of its own, e.g. trackPageView('/contact', 'Contact')
export function trackPageView(url, title) {
  send((props) => ({ ...props, url, title }))
}

// An event with an optional object of details, e.g. trackEvent('contact-open', { from: 'nav' })
export function trackEvent(name, data) {
  send(name, data)
}
