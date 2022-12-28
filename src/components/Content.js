import React, { useContext } from 'react'
import { Context } from './ContextProvider'
import { contentData } from '../data/contentData'
import { ScrollDown } from './scrollDown'
import { ContactContext } from './ContextProvider'

export function Content(props) {
    const [currentScene, setCurrentScene] = useContext(Context)
    const [toggleCont, setToggleCont] = useContext(ContactContext)

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
                <p>Hi! I'm Oscar Brenes a frontend developer from Costa Rica, I have been working for what now it's Critical Mass Latam for the past 7&nbsp;years</p>
            </div>
            <div className='content third right bottom'>
                <p>I have gain experience on different positions and moved from a small design team that supported GoDaddy to a giant tech team that carry on BMW USA website</p>
            </div>
        </section>
        <section id="jpn" className={currentScene === 2 && !toggleCont ? "active" : "inactive"}>
            <div className='content third left top'>
                <p>3 years ago I visited Japan and fell in love with the culture and the beauty of the country, now I feel that's my time go back and stablish myself</p>
            </div>
            <div className='content third right bottom'>
                <p>Currently I'm looking for a job opportunity that takes me to Tokyo, feel free to reach me out</p>
            </div>
        </section>
    </>
  )
}