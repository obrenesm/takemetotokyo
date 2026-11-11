import React, { useLayoutEffect, useRef } from 'react'
import { useContact } from '../../providers/contextProvider'
import { useLanguage } from '../../providers/languageProvider'
import { LanguageSwitch } from '../languageswitch/LanguageSwitch'
import { CONTACT_EMAIL, getContactConfig } from '../../utils/contactForm'
import { ContactForm } from './ContactForm'
import { ContactToggleContent } from './ContactToggle'
import { CopyEmail } from './CopyEmail'
import './ContactMe.scss'

const LINKEDIN_URL = 'https://www.linkedin.com/in/obrenesm'

// Back to whatever opened the dialog, or to the contact button if that's gone or hidden
function returnFocus(opener) {
  const candidates = [opener, document.getElementById('contact-btn')]

  for (const element of candidates) {
    if (!element || !element.isConnected) continue
    element.focus({ preventScroll: true })
    if (document.activeElement === element) return
  }
}

// A modal <dialog>: showModal() traps the focus, closes on Esc and makes the rest of the page inert.
// The open state lives in Home (useContactState), this keeps the element in step with it.
export function ContactMe() {
  const { open, closeContact, openerRef } = useContact()
  const { t } = useLanguage()
  const { enabled, endpoint, siteKey } = getContactConfig()
  const dialogRef = useRef(null)
  const titleRef = useRef(null)
  const wasOpen = useRef(false)

  useLayoutEffect(() => {
    const dialog = dialogRef.current

    if (open && !dialog.open) {
      dialog.showModal()
      // The title rather than the first field: screen readers start from the top, and phones
      // don't pop up the keyboard over the dialog before you've even seen it
      titleRef.current.focus()
    } else if (!open && wasOpen.current) {
      // Closed with the Close button (Esc and the like have already closed the element)
      if (dialog.open) dialog.close()
      returnFocus(openerRef.current)
    }

    wasOpen.current = open
  }, [open, openerRef])

  const linkedin = (
    <a href={LINKEDIN_URL} rel="noopener noreferrer" target="_blank">LinkedIn</a>
  )

  return (
    <dialog
      ref={dialogRef}
      id='contact-dialog'
      className='contact-dialog'
      aria-labelledby='contact-title'
      onClose={closeContact}
    >
      <button
        type='button'
        className='contact-toggle contact-close'
        aria-label={t('contact.close')}
        onClick={closeContact}
      >
        <ContactToggleContent text={t('nav.contact')} decorative />
      </button>

      <div className='contact-scroll'>
        <div className='contact-content'>
          <h2 id='contact-title' ref={titleRef} tabIndex={-1}>{t('contact.title')}</h2>

          {enabled ? (
            <>
              <ContactForm open={open} endpoint={endpoint} siteKey={siteKey} />
              <p className='contact-elsewhere'>
                {t('contact.elsewhere', {
                  // Together, so the copy button never ends up alone at the start of a line
                  email: (
                    <span className='contact-email'>
                      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                      <CopyEmail email={CONTACT_EMAIL} />
                    </span>
                  ),
                  linkedin,
                  // A new tab, so whoever is filling in the form doesn't lose it
                  journey: <a href='/journey' target='_blank' rel='noopener noreferrer'>{t('contact.journeyLink')}</a>,
                })}
              </p>
            </>
          ) : (
            <div className='contact-links'>
              <a href={`mailto:${CONTACT_EMAIL}`} className='mail'>{CONTACT_EMAIL}</a>
              <a href={LINKEDIN_URL} rel="noopener noreferrer" target="_blank" className='external'>LinkedIn</a>
            </div>
          )}
        </div>

        <div className='credits-disclaimer'>
          <p>
            {t('contact.creditsDisclaimer', {
              link: <a href="/credits" target="_blank">{t('contact.creditsLink')}</a>
            })}
          </p>
        </div>
      </div>

      {/* Last in the tab order, after the content (on desktop it's in the bottom left corner) */}
      <LanguageSwitch inDialog />
    </dialog>
  )
}
