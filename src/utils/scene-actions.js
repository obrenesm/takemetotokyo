//import React, { useContext } from 'react'
import { scenes } from '../data/scenesData';
// import { ContactContext } from './ContextProvider'


// const [toggleCont, setToggleCont] = useContext(ContactContext)


export const SCENE_ACTIONS = {
  NEXT: 'Next',
  BACK: 'Back',
  RETURN: 'Return',
  NONE: ''
}

export function getActionByCursor(currentScene, camDeviation) {
  if (currentScene === 0) {
    // if (toggleCont) {
    //   return console.log('modal open');
    // }
    return SCENE_ACTIONS.NEXT
    
  } else if (currentScene === scenes.length - 1) {
    return SCENE_ACTIONS.BACK;
  } else {
    return camDeviation && camDeviation[0] < 0 ? SCENE_ACTIONS.BACK : SCENE_ACTIONS.NEXT;
  }
}

//TODO: touch scroll

// export function getActionByTouch(currentScene, camDeviation) {
//   if (currentScene === 0) {
//     return SCENE_ACTIONS.NEXT
//   } else if (currentScene === scenes.length - 1 && camDeviation && camDeviation[0] > 0) {
//     return SCENE_ACTIONS.RETURN;
//   } else {
//     return camDeviation && camDeviation[0] < 0 ? SCENE_ACTIONS.BACK : SCENE_ACTIONS.NEXT;
//   }
// }