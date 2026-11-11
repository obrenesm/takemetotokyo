import React, { useContext } from 'react'
import { ContactContext } from '../../providers/contextProvider'
import { useLanguage } from '../../providers/languageProvider'
import './ContactMe.scss'

export function ContactMe(props) {
  const [toggleCont] = useContext(ContactContext)
  const { t } = useLanguage()
  
  return (
    <>
        <div className={`modal ${toggleCont ? 'modal-open' : ''}`} id='contact-modal'>
          <div className='modal-container'>
            <section>
              <h2>{t('contact.title')}</h2>
              <a href="mailto:oscar@take-me.jp" className='mail'>oscar@take-me.jp</a>
              {/* <a href="tel:+81 08091963097" className='tel'>+81 080 9196 3097</a> */}
            </section>
            <section className='extLinks'>
              {/* <a href="/journey" target="_blank" className='external'>Resume</a> */}
              <a href="https://www.linkedin.com/in/obrenesm" rel="noopener noreferrer" target="_blank" className='external'>LinkedIn</a>
            </section>
          </div>
          <div className='credits-disclaimer'>
              <p>
                {t('contact.creditsDisclaimer', {
                  link: <a href="/credits" target="_blank" className='external'>{t('contact.creditsLink')}</a>
                })}
              </p>
          </div>
        </div>
    </>
  )
}