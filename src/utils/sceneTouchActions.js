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

export const onTouchEnd = (currentScene, touchStart, touchEnd) => {
  if (!touchStart || !touchEnd) return (
    SCENE_ACTIONS.NONE
    )
  
  const distance = touchStart - touchEnd
  // 20 is the minSwipeDistance
  const isDownSwipe = distance > 20
  const isUpSwipe = distance < -20

  if (isUpSwipe && currentScene > 0 ) {
    return SCENE_ACTIONS.BACK
    
  } else if (isDownSwipe && currentScene < scenes.length - 1) {
    return SCENE_ACTIONS.NEXT;
  } else {
    return SCENE_ACTIONS.NONE;
  }
}