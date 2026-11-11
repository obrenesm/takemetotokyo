import { SCENE_ACTIONS, withinScenes } from './sceneActions'

// A swipe has to be longer than this (px): anything shorter is a tap
const MIN_SWIPE_DISTANCE = 20

const touchPoint = (e) => ({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })

// `swipe` is a ref, so following the finger doesn't re-render the page
export const onTouchStart = (e, swipe) => {
  // No end until the finger moves, so a tap is never a swipe
  swipe.current = { start: touchPoint(e), end: null }
}

export const onTouchMove = (e, swipe) => {
  if (swipe.current) swipe.current.end = touchPoint(e)
}

// Up or left goes forward, down or right goes back. The hint only says "swipe" and the globe spins
// sideways between scenes, so people try sideways swipes too (left for the next one, like a carousel).
// The way the finger moved the most decides.
export const onTouchEnd = (currentScene, swipe) => {
  const { start, end } = swipe.current ?? {}
  swipe.current = null
  if (!start || !end) return SCENE_ACTIONS.NONE

  const dx = end.x - start.x
  const dy = end.y - start.y
  const distance = Math.abs(dx) > Math.abs(dy) ? dx : dy

  if (Math.abs(distance) <= MIN_SWIPE_DISTANCE) return SCENE_ACTIONS.NONE
  return withinScenes(currentScene, distance < 0 ? SCENE_ACTIONS.NEXT : SCENE_ACTIONS.BACK)
}
