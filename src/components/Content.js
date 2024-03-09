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
              <h1>Take me to <span>Tokyo</span></h1>
            </div>
            { currentScene === 0 && isTouchEnabled() ? <ScrollDown/> : ''}
        </section>
        <section id="cr" className={currentScene === 1 && !toggleCont ? "active" : "inactive"}>
            <div className='content third left top'>
                <p>
                    Hi! I'm Oscar, from Costa Rica. Currently I'm the CTO at Buzz, previously I worked for more than seven years for <Tooltip content="Previously known as Hangar, latter Hangar Worldwide, and recently fully integrated as part of Critical Mass" direction="down">Critical Mass</Tooltip>
                </p>
            </div>
            <div className='content third right bottom'>
                <p>I have grown a lot learning from my different roles, from a small design team providing creative services to a huge tech team that supports the BMW USA website. And now to be in charge of a whole department. But, it's time for my next big step: Tokyo.</p>
            </div>
        </section>
        <section id="jpn" className={currentScene === 2 && !toggleCont ? "active" : "inactive"}>
            <div className='content third left top'>
                <p>Five years ago, I visited Japan for the first time and was captivated by the culture. Since then, I've been longing to return and establish a life in this beautiful country.</p>
            </div>
            <div className='content third right bottom'>
                <p>This is where you can join the journey! I'm currently working to start my own Digital Agency on Japan. It doesn't matter if you have a business proposal or just want to say hi, feel free to <span onClick={toggleContactState} className={'modal-cta'}>reach&nbsp;out.</span></p>
            </div>
        </section>
    </>
  )
}