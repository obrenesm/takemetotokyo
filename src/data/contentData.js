import React from "react"
import { ScrollDown } from "../components/scrollDown"

export const contentData = [
    { 
        id: 'Intro',
        cont: 
        <>
          <section className="intro visible">
            <div className='popup center headline'>
              <h1>Take me to <span>Tokyo</span></h1>
            </div>
            <ScrollDown/>
          </section>
        </>
    },
    { 
        id: 'CR',
        cont:
        <>
          <section className="cr visible">
            <div className='popup'>
              <p className="left top"> I'm a Front End developer from Costa Rica</p>
            </div>
          </section>
        </>
    },
    { 
        id: 'Jpn',
        cont:
        <>
          <section className="intro visible">
            <div className='popup center headline'>
              <h1>Tokio</h1>
            </div>
          </section>
        </>
    }
]