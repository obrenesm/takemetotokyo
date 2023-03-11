import React, { useContext } from 'react'
import { Context } from '../ContextProvider'
import { ScrollDown } from '../scrolldown/scrollDown'
import { ContactContext } from '../ContextProvider'
import './ContactMe.scss'


export function ContactMe(props) {

  const [toggleCont, setToggleCont] = useContext(ContactContext)
  return (
    <>
        <div className={`modal ${toggleCont ? 'modal-open' : ''}`} id='contact-modal' 
        // open={toggleCont}
        >
          <div className='modal-container'>
            <section>
              <h2>Let's talk!</h2>
              <p>Here goes a text that say something catchy.</p>
              <a href="mailto:exor.os car@gmail.com" className='mail'>exor.oscar@gmail.com</a>
              <a href="tel:+50688117533" className='tel'>+506 88 11 75 33</a>
            </section>
            <section className='extLinks'>
              <a href="/resume" target="_blank" className='external'>Resume</a>
              <a href="https://www.linkedin.com/in/obrenesm" rel="noopener noreferrer" target="_blank" className='external'>LinkedIn</a>
            </section>
          </div>
          <div className='credits-disclaimer'>
              <p>I used and modified assets under a creative commons license. If you want to check the authors, or just see what I modified <a href="/credits" target="_blank" className='external'>click here</a></p>
          </div>
        </div>
    </>
  )
}