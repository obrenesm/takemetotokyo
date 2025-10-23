import React, { useContext } from 'react'
import { ContactContext } from '../../providers/contextProvider'
import './ContactMe.scss'

export function ContactMe(props) {
  const [toggleCont, setToggleCont] = useContext(ContactContext)
  
  return (
    <>
        <div className={`modal ${toggleCont ? 'modal-open' : ''}`} id='contact-modal'>
          <div className='modal-container'>
            <section>
              <h2>Let's talk!</h2>
              <a href="mailto:oscar@imavailable.fyi" className='mail'>oscar@imavailable.fyi</a>
              <a href="tel:+81 080-9196-3097" className='tel'>+81 08091963097</a>
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