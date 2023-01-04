import { scenes } from '../data/scenesData';

export const SCENE_ACTIONS = {
  NEXT: 'Next',
  BACK: 'Back',
  RETURN: 'Return'
}

export function getActionByCursor(currentScene, camDeviation) {
  if (currentScene === 0) {
    return SCENE_ACTIONS.NEXT
  } else if (currentScene === scenes.length - 1 && camDeviation && camDeviation[0] > 0) {
    return SCENE_ACTIONS.RETURN;
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