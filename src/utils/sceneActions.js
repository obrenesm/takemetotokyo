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

// Swipes and arrow keys can point either way from any scene: NONE when there's no scene that way
export function withinScenes(currentScene, action) {
  if (action === SCENE_ACTIONS.NEXT && currentScene < scenes.length - 1) return action
  if (action === SCENE_ACTIONS.BACK && currentScene > 0) return action
  return SCENE_ACTIONS.NONE
}
