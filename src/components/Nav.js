import React, { useContext, useState } from 'react'
import { Context } from './ContextProvider'
import { ScrollDown } from './scrollDown'
import { ContactMe } from './ContactMe'

export function Nav(props) {
    //const [currentScene, setCurrentScene] = useContext(Context)

    const [contactState, setContactState] = useState(false)
    const toggleContactState = () => {
      setContactState(current => !current);
    };
  return (
    <>
        <button id="contact-btn" onClick={toggleContactState}>
            Contact Me
        </button>
        { contactState && <ContactMe/>}
    </>
  )
}