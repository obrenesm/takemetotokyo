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
              <h1>Take me — <span>Japan</span></h1>
            </div>
            { currentScene === 0 && isTouchEnabled() ? <ScrollDown/> : ''}
        </section>
        <section id="cr" className={currentScene === 1 && !toggleCont ? "active" : "inactive"}>
            <div className='content third left top'>
                <p>
                    Hi! I'm Oscar, from Costa Rica. I recently wrapped up my role as CTO at Buzz, after more than seven years with <Tooltip content="Previously know as Hangar, and latter fully integrated as part of Critical Mass" direction="down">Critical Mass</Tooltip>.
                </p>
            </div>
            <div className='content third right bottom'>
                <p>
                    My career has taken me from a small creative team to building the technology behind the BMW USA website, and eventually leading an entire department. Along the way, I've developed a passion for connecting design, technology, and people.
                </p>
            </div>
        </section>
        <section id="jpn" className={currentScene === 2 && !toggleCont ? "active" : "inactive"}>
            <div className='content third left top'>
                <p>I first visited Japan almost 8 years ago and quickly felt a connection with the country. Last year, I returned as a language student, and that experience made one thing clear: I want to build my life here.</p>
            </div>
            <div className='content third right bottom'>
                <p> I'm excited to explore opportunities where my professional experience and personal interests come together. Have a project or opportunity in mind? <span onClick={toggleContactState} className={'modal-cta'}>Let's&nbsp;talk!</span></p>
            </div>
        </section>
    </>
  )
}