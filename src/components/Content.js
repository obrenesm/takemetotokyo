import React, { useContext } from 'react'
import { ScrollDown } from './scrolldown/ScrollDown'
import { Tooltip } from './tooltip/Tooltip'
import { ContactContext } from '../providers/contextProvider'
import { useLanguage } from '../providers/languageProvider'
import { isTouchEnabled } from './../utils/utils'

export function Content({currentScene}) {
    const [toggleCont, setToggleCont] = useContext(ContactContext)
    const { t } = useLanguage()

    const toggleContactState = () => {
      setToggleCont(current => !current);
    };

  return (
    <>
        <section id="intro" className={currentScene === 0 && !toggleCont ? "active" : "inactive"}>
            <div className='content full center headline'>
              <h1>{t('home.headline.lead')}<span>{t('home.headline.highlight')}</span></h1>
            </div>
            { currentScene === 0 && isTouchEnabled() ? <ScrollDown/> : ''}
        </section>
        <section id="cr" className={currentScene === 1 && !toggleCont ? "active" : "inactive"}>
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
        <section id="jpn" className={currentScene === 2 && !toggleCont ? "active" : "inactive"}>
            <div className='content third left top'>
                <p>{t('home.jpn.visit')}</p>
            </div>
            <div className='content third right bottom'>
                <p>
                  {t('home.jpn.opportunities', {
                    cta: <span onClick={toggleContactState} className={'modal-cta'}>{t('home.jpn.cta')}</span>
                  })}
                </p>
            </div>
        </section>
    </>
  )
}