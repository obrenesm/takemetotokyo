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
              <p>I would love to hear from you, even if your aren't exactly on Tokyo</p>
              <a href="mailto:contact@oscarbrenes.in" className='mail'>contact@oscarbrenes.in</a>
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