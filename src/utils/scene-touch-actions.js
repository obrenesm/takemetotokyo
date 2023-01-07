import { scenes } from '../data/scenesData';

export const SCENE_ACTIONS = {
  NEXT: 'Next',
  BACK: 'Back',
  RETURN: 'Return',
  NONE: ''
}

export const onTouchStart = (e, setTouchStart, setTouchEnd) => {
  setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
  setTouchStart(e.targetTouches[0].clientY)
}

export const onTouchMove = (e, setTouchEnd) => setTouchEnd(e.targetTouches[0].clientY)

// export const onTouchEnd = (touchStart, touchEnd) => {
//   if (!touchStart || !touchEnd) return
//   const distance = touchStart - touchEnd

//   // 20 is the minSwipeDistance
//   const isDownSwipe = distance > 20
//   const isUpSwipe = distance < -20

  
//   if (isDownSwipe || isUpSwipe) console.log('swipe', isDownSwipe ? 'down' : 'up')
//   // add your conditional logic here

// }

export const actionOnTouchEnd = (currentScene, touchStart, touchEnd) => {
  if (!touchStart || !touchEnd) return
  const distance = touchStart - touchEnd

  // 20 is the minSwipeDistance
  const isDownSwipe = distance > 20
  const isUpSwipe = distance < -20

  console.log('currentScene', currentScene);
  if (isDownSwipe || isUpSwipe) console.log('swipe', isDownSwipe ? 'down' : 'up')

  if (isUpSwipe && currentScene > 0 ) {
    // if (toggleCont) {
    //   return console.log('modal open');
    // }
    console.log('UP');
    return SCENE_ACTIONS.BACK
    
  } else if (isDownSwipe && currentScene < scenes.length - 1) {
    console.log('DOWN');
    return SCENE_ACTIONS.NEXT;
  } else {
    return SCENE_ACTIONS.NONE
  }
}