import { scenes } from '../data/scenesData';

export const SCENE_ACTIONS = {
  NEXT: 'Next',
  BACK: 'Back',
  RETURN: 'Return',
  NONE: ''
}

export function getActionByCursor(currentScene, camDeviation) {
  if (currentScene === 0) {
    return SCENE_ACTIONS.NEXT
    
  } else if (currentScene === scenes.length - 1) {
    return SCENE_ACTIONS.BACK;
  } else {
    return camDeviation && camDeviation[0] < 0 ? SCENE_ACTIONS.BACK : SCENE_ACTIONS.NEXT;
  }
}