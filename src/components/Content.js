import React from 'react'
import { ScrollDown } from './scrolldown/ScrollDown'
import { Tooltip } from './tooltip/Tooltip'
import { useContact } from '../providers/contextProvider'
import { useLanguage } from '../providers/languageProvider'
import { isTouchEnabled } from './../utils/utils'

export function Content({currentScene}) {
    const { open: contactOpen, openContact } = useContact()
    const { t } = useLanguage()

  return (
    <>
        <section id="intro" className={currentScene === 0 && !contactOpen ? "active" : "inactive"}>
            <div className='content full center headline'>
              <h1>{t('home.headline.lead')}<span>{t('home.headline.highlight')}</span></h1>
            </div>
            { currentScene === 0 && isTouchEnabled() ? <ScrollDown/> : ''}
        </section>
        <section id="cr" className={currentScene === 1 && !contactOpen ? "active" : "inactive"}>
            <div className='content third left top'>
                <p>
                    {t('home.cr.intro', {
                      criticalMass: <Tooltip content={t('home.cr.criticalMassTooltip')} direction="down">Critical Mass</Tooltip>
                    })}
                </p>
            </div>
            <div className='content third right bottom'>
                <p>
                    {t('home.cr.career')}
                </p>
            </div>
        </section>
        <section id="jpn" className={currentScene === 2 && !contactOpen ? "active" : "inactive"}>
            <div className='content third left top'>
                <p>{t('home.jpn.visit')}</p>
            </div>
            <div className='content third right bottom'>
                <p>
                  {t('home.jpn.opportunities', {
                    cta: (
                      <button
                        type="button"
                        className='modal-cta'
                        aria-haspopup="dialog"
                        onClick={(event) => openContact(event.currentTarget)}
                      >
                        {t('home.jpn.cta')}
                      </button>
                    )
                  })}
                </p>
            </div>
        </section>
    </>
  )
}