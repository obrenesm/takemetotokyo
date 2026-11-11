import { SCENE_ACTIONS, withinScenes } from './sceneActions'

// Down and right go forward, up and left go back
const ARROW_ACTIONS = {
  ArrowDown: SCENE_ACTIONS.NEXT,
  ArrowRight: SCENE_ACTIONS.NEXT,
  ArrowUp: SCENE_ACTIONS.BACK,
  ArrowLeft: SCENE_ACTIONS.BACK,
}

// In a text field the arrows move the caret
const isEditable = (target) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

export function getActionByKey(currentScene, event) {
  const action = ARROW_ACTIONS[event.key]

  if (
    !action ||
    // With a modifier the arrows belong to the browser, the system or a screen reader (Alt+← goes back...)
    event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
    // Holding a key down repeats it: one press is one scene, it doesn't race through all of them
    event.repeat ||
    event.defaultPrevented ||
    isEditable(event.target)
  ) {
    return SCENE_ACTIONS.NONE
  }

  return withinScenes(currentScene, action)
}
