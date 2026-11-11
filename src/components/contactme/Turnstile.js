import React, { useEffect, useRef } from 'react'

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let loading = null

// Cloudflare's script loads once, the first time the contact form is shown (not with the page)
export function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile)

  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = SCRIPT_URL
      script.async = true
      script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile did not start')))
      script.onerror = () => {
        // Blocked or offline: the next attempt adds the script again
        loading = null
        script.remove()
        reject(new Error('Turnstile could not load'))
      }
      document.head.appendChild(script)
    })
  }

  return loading
}

// The Turnstile widget. A token is single use: to get a new one, render a new widget (change its key).
//   onToken(token)  the check passed
//   onExpire()      the token expired or the widget hit an error (it retries and refreshes by itself)
//   onFail()        the script couldn't load, the widget won't show up
export function Turnstile({ siteKey, language, onToken, onExpire, onFail }) {
  const containerRef = useRef(null)
  const handlers = useRef({ onToken, onExpire, onFail })
  handlers.current = { onToken, onExpire, onFail }

  useEffect(() => {
    let active = true
    let widgetId = null

    loadTurnstile().then(
      (turnstile) => {
        const container = containerRef.current
        if (!active || !container) return

        widgetId = turnstile.render(container, {
          sitekey: siteKey,
          action: 'contact',
          theme: 'dark',
          language,
          // 'flexible' fills the column but can't get narrower than 300px
          size: container.clientWidth && container.clientWidth < 300 ? 'compact' : 'flexible',
          callback: (token) => handlers.current.onToken(token),
          'expired-callback': () => handlers.current.onExpire(),
          'error-callback': () => {
            handlers.current.onExpire()
            return true // handled: the widget shows its own error and retries
          },
        })
      },
      () => {
        if (active) handlers.current.onFail()
      }
    )

    return () => {
      active = false
      if (widgetId !== null) window.turnstile?.remove(widgetId)
    }
  }, [siteKey, language])

  return <div className='contact-turnstile' ref={containerRef} />
}
