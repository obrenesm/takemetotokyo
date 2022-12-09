import React, { useContext } from 'react'
import { Context } from './ContextProvider'
import { ScrollDown } from './scrollDown'

export function ContactMe(props) {
  return (
    <>
        <scene className='modal' id='contact-modal'>
          <div className='modal-container'>
            <h2>Hi!</h2>
            <h3>Contact Me</h3>
            <p>Here goes a text that say something catchy</p>
            <span className='mail'>exor.oscar@gmail.com</span>
          </div>
        </scene>
    </>
  )
}