import React from 'react'
import { ContactMe } from './contactme/ContactMe'
import { ContactToggleContent } from './contactme/ContactToggle'
import { LanguageSwitch } from './languageswitch/LanguageSwitch'
import { useContact } from '../providers/contextProvider'
import { useLanguage } from '../providers/languageProvider'

export function Nav(props) {
    const { open, openContact } = useContact()
    const { t } = useLanguage()

  return (
    <>
        <LanguageSwitch covered={open}/>
        {/* It only opens the dialog: while it's open everything outside it is inert, so the
            dialog has its own Close button drawn in this same spot */}
        <button
          type="button"
          id="contact-btn"
          className={`contact-toggle ${open ? 'open' : ''}`}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="contact-dialog"
          onClick={(event) => openContact(event.currentTarget)}
        >
          <ContactToggleContent text={t('nav.contact')} />
        </button>
        <ContactMe/>
    </>
  )
}
