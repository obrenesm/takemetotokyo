import React, { useContext } from 'react'
import { Context } from './ContextProvider'
import { contentData } from '../data/contentData'
import { ScrollDown } from './scrollDown'
import { ContactContext } from './ContextProvider'

export function Content(props) {
    const [currentScene, setCurrentScene] = useContext(Context)
    const [toggleCont, setToggleCont] = useContext(ContactContext)
//    const currentContent = contentData[currentScene]

//     switch (currentContent) {
//         case 2:
//             const jpn = true
// s            break;
//         case 1:
//             const cr = true
//             break;
//         case 0:
//             const intro = true
            
//             break;
//         default:
//           console.log(`Sorry, we are out of ${expr}.`);
//       }
      

  return (
    <>
        <section id="intro" className={currentScene === 0 && !toggleCont ? "active" : "inactive"}>
            <div className='popup full center headline'>
              <h1>Take me to <span>Tokyo</span></h1>
            </div>
            <ScrollDown/>
        </section>
        <section id="cr" className={currentScene === 1 && !toggleCont ? "active" : "inactive"}>
            <div className='popup third left top'>
                <p> I'm Oscar Brenes a Front End developer from Costa Rica, have been working for Critical Mass Latam for the past 7 years</p>
            </div>
            <div className='popup third right bottom'>
                <p> The last 4 years I have been on the tech team of the BMW USA, before that I worked as a Designer on the GoDaddy team</p>
            </div>
        </section>
        <section id="jpn" className={currentScene === 2 && !toggleCont ? "active" : "inactive"}>
            <div className='popup third left top'>
                <p> 3 years ago I visited Japan and fell in love with the culture and the beauty of the country, now I want to go back</p>
            </div>
            <div className='popup third right bottom'>
                <p> Currently I'm looking for a job opportunity that takes me to Tokyo </p>
            </div>
        </section>

    </>
  )
}