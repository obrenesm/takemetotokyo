import React, { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../providers/languageProvider'
import './CopyEmail.scss'

// Without clipboard permission (some embedded browsers and privacy settings) the old copy command
// still works: it copies what's selected, so the text goes in a hidden field for a moment. The field
// goes next to the button, inside the dialog: outside a modal dialog nothing can be selected.
function copyWithSelection(text, container) {
  const field = document.createElement('textarea')
  field.value = text
  field.setAttribute('readonly', '')
  field.setAttribute('aria-hidden', 'true')
  field.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none'
  container.appendChild(field)

  const previous = document.activeElement
  field.focus({ preventScroll: true })
  field.select()
  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch (error) {
    copied = false
  }
  field.remove()
  previous?.focus({ preventScroll: true })

  return copied
}

async function copyText(text, container) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // No Clipboard API (a page without https) or no permission
    return copyWithSelection(text, container)
  }
}

// A small button that copies the e-mail address. For a moment, a bubble above it says whether it
// worked, and screen readers announce the same text (the bubble is a polite live region).
// `className` goes on the wrapper, for pages that restyle it.
export function CopyEmail({ email, className }) {
  const { t } = useLanguage()
  // null, 'copied' or 'failed'
  const [result, setResult] = useState(null)
  const wrapperRef = useRef(null)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    const copied = await copyText(email, wrapperRef.current)

    setResult(copied ? 'copied' : 'failed')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setResult(null), 2000)
  }

  return (
    <span className={['contact-copy', className].filter(Boolean).join(' ')} ref={wrapperRef}>
      <button
        type='button'
        className={`contact-copy-button ${result === 'copied' ? 'copied' : ''}`}
        aria-label={t('contact.copy.label')}
        onClick={copy}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
          {result === 'copied' ? (
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          ) : (
            <>
              <rect x="8" y="8" width="12" height="12" rx="2" />
              <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
            </>
          )}
        </svg>
      </button>
      <span className='contact-copy-result' aria-live='polite'>
        {result && t(`contact.copy.${result}`)}
      </span>
    </span>
  )
}
