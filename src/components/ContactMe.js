import React, { useContext } from 'react'
import { Context } from './ContextProvider'
import { ScrollDown } from './scrollDown'
import { ContactContext } from './ContextProvider'


export function ContactMe(props) {

  const [toggleCont, setToggleCont] = useContext(ContactContext)
  return (
    <>
        <section className= {`modal ${toggleCont ? 'modal-visible' : ''}`} id='contact-modal' 
        // open={toggleCont}
        >
          <div className='modal-container'>
            <h2>Let's talk!</h2>
            <p>Here goes a text that say something catchy.</p>
            <a href="mailto:exor.os car@gmail.com" className='mail'>exor.oscar@gmail.com</a>
            <a href="tel:+50688117533" className='mail'>+506 88 11 75 33</a>
          </div>
        </section>
    </>
  )
}