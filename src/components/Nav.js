import React, { useContext, useState } from 'react'
import { Context } from './ContextProvider'
import { ScrollDown } from './scrollDown'
import { ContactMe } from './ContactMe'
import { ContactContext } from './ContextProvider'

export function Nav(props) {
    //const [currentScene, setCurrentScene] = useContext(Context)

    //const [contactState, setContactState] = useState(false)
    const [toggleCont, setToggleCont] = useContext(ContactContext)

    const toggleContactState = () => {
      setToggleCont(current => !current);
    };
    
  return (
    <>
        <button id="contact-btn" onClick={toggleContactState}>
            Contact Me
        </button>
        <ContactMe/>
    </>
  )
}