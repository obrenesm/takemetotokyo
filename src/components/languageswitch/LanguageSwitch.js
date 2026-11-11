import React from 'react'
import { useLanguage } from '../../providers/languageProvider'
import { translations } from '../../data/translations'
import './LanguageSwitch.scss'

// Shows the language you can switch to, written in that language ("日本語" / "English"),
// so it's readable by the people who need it. lang= lets screen readers pronounce it right.
// The contact dialog has its own copy in the same spot (`inDialog`): while it's open the page's
// button is inert and under it, so that one hides (`covered`).
export function LanguageSwitch({ inDialog = false, covered = false }) {
  const { otherLanguage, setLanguage } = useLanguage()
  const { name, label } = translations[otherLanguage].languageSwitch

  return (
    <button
      type="button"
      id={inDialog ? undefined : 'language-btn'}
      className={`language-switch ${covered ? 'covered' : ''}`}
      lang={otherLanguage}
      aria-label={label}
      onClick={() => setLanguage(otherLanguage)}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
        <ellipse cx="12" cy="12" rx="4.2" ry="10" strokeWidth="1.5" />
        <path d="M2.5 9h19M2.5 15h19" strokeWidth="1.5" />
      </svg>
      <span>{name}</span>
    </button>
  )
}
