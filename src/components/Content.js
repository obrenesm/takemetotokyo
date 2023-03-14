import React, { useContext } from 'react'
// import { Context } from './ContextProvider'
import { ScrollDown } from './scrolldown/scrollDown'
import { ContactContext } from './ContextProvider'
import { Tooltip } from './tooltip/Tooltip'
// import Tooltip from '@mui/material/Tooltip'

// import { TooltipIcon } from '/assets/icon-tooltip-info.png'


export function Content({currentScene, ...props}) {
    // const [currentScene, setCurrentScene] = useContext(Context)
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
            <ScrollDown/>
        </section>
        <section id="cr" className={currentScene === 1 && !toggleCont ? "active" : "inactive"}>
            <div className='content third left top'>
            <p>
                Hi! I'm Oscar, a detail-oriented front-end developer from Costa Rica. I've been working for <Tooltip content="Previously known as Hangar, latter Hangar Worldwide, and recently fully integrated as part of Critical Mass" direction="down">Critical Mass</Tooltip>the past 7 years and it has been a great journey, learning more about my skills and honing my craft.
            </p>
            </div>
            <div className='content third right bottom'>
                <p>Grew a lot learning from different positions, from a small design team providing creative services for GoDaddy to a giant tech team that supports the BMW USA website experience. Now, it's time for my next big step: Tokyo.</p>
            </div>
        </section>
        <section id="jpn" className={currentScene === 2 && !toggleCont ? "active" : "inactive"}>
            <div className='content third left top'>
                <p>Three years ago, I visited Japan for the first time and was captivated by the culture. Since then, I've been longing to return and establish a life in this beautiful country.</p>
            </div>
            <div className='content third right bottom'>
                <p>This is where you can join the journey! I'm looking for an opportunity that takes me to Tokyo. Feel free to <span onClick={toggleContactState} className={'modal-cta'}>reach&nbsp;out.</span></p>
            </div>
        </section>
    </>
  )
}