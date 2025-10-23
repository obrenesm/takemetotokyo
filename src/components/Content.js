import React, { useContext } from 'react'
import { ScrollDown } from './scrolldown/ScrollDown'
import { Tooltip } from './tooltip/Tooltip'
import { ContactContext } from '../providers/contextProvider'
import { isTouchEnabled } from './../utils/utils'

export function Content({currentScene}) {
    const [toggleCont, setToggleCont] = useContext(ContactContext)

    const toggleContactState = () => {
      setToggleCont(current => !current);
    };

  return (
    <>
        <section id="intro" className={currentScene === 0 && !toggleCont ? "active" : "inactive"}>
            <div className='content full center headline'>
              <h1>Taken — <span>by Tokyo</span></h1>
            </div>
            { currentScene === 0 && isTouchEnabled() ? <ScrollDown/> : ''}
        </section>
        <section id="cr" className={currentScene === 1 && !toggleCont ? "active" : "inactive"}>
            <div className='content third left top'>
                <p>
                    Hi! I'm Oscar, from Costa Rica. Until recently, I was the CTO at Buzz, and before that, I spent over seven years at <Tooltip content="Previously Hangar, latter Hangar Worldwide, and latter fully integrated as part of Critical Mass" direction="down">Critical Mass</Tooltip>
                </p>
            </div>
            <div className='content third right bottom'>
                <p>My journey has taken me from being part of an small design team to the tech squad behind the BMW USA website, and eventually to leading an entire department. Now, it's time for my next big chapter: Japan.</p>
            </div>
        </section>
        <section id="jpn" className={currentScene === 2 && !toggleCont ? "active" : "inactive"}>
            <div className='content third left top'>
                <p>I first visited Japan six years ago and instantly fell in love with its culture. Last year, I came back, this time as a language student, and it confirmed what I already knew: I want to build a long-term life here.</p>
            </div>
            <div className='content third right bottom'>
                <p>Whether you've got a project idea, a job opportunity, or just want to say hi, feel free to <span onClick={toggleContactState} className={'modal-cta'}>reach&nbsp;out.</span></p>
            </div>
        </section>
    </>
  )
}