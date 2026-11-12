// Visits and a few events, counted by Umami Cloud (cloud.umami.is). No cookies, nothing personal.
// Umami's script counts each page on its own, also the routes changed without a reload (/journey,
// /credits). The rest are events sent from here with trackEvent.
//
// The website ID is set at build time (.env.production). Without it (npm start, tests) nothing
// loads and trackEvent does nothing. ANALYTICS_DOMAIN keeps Vercel's preview deployments and
// localhost out of the numbers even when a build has the ID.

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
  document.head.appendChild(script)
}

// An event with an optional object of details, e.g. trackEvent('contact-open', { from: 'nav' }).
// Lost if the script hasn't arrived yet (or is blocked): counting must never break the page.
export function trackEvent(name, data) {
  try {
    window.umami?.track(name, data)
  } catch (error) {
    // Nothing to do: a missed count isn't worth an error
  }
}
