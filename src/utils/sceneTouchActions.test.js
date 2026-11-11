import { onTouchEnd, onTouchMove, onTouchStart } from './sceneTouchActions'
import { SCENE_ACTIONS } from './sceneActions'
import { scenes } from '../data/scenesData'

const { NEXT, BACK, NONE } = SCENE_ACTIONS
const LAST = scenes.length - 1

const touchAt = ([x, y]) => ({ targetTouches: [{ clientX: x, clientY: y }] })

// The finger touches `from`, moves to `to` (if given) and lifts
function swipe(currentScene, from, to) {
  const ref = { current: null }
  onTouchStart(touchAt(from), ref)
  if (to) onTouchMove(touchAt(to), ref)
  return onTouchEnd(currentScene, ref)
}

test('swiping up or left goes to the next scene', () => {
  expect(swipe(0, [200, 500], [200, 300])).toBe(NEXT)
  expect(swipe(0, [300, 400], [100, 400])).toBe(NEXT)
})

test('swiping down or right goes back', () => {
  expect(swipe(LAST, [200, 300], [200, 500])).toBe(BACK)
  expect(swipe(LAST, [100, 400], [300, 400])).toBe(BACK)
})

test('the way the finger moved the most decides', () => {
  expect(swipe(1, [300, 400], [150, 460])).toBe(NEXT) // mostly left, a bit down
  expect(swipe(1, [200, 500], [260, 300])).toBe(NEXT) // mostly up, a bit right
  expect(swipe(1, [100, 400], [260, 360])).toBe(BACK) // mostly right, a bit up
  expect(swipe(1, [200, 300], [140, 480])).toBe(BACK) // mostly down, a bit left
})

test('taps and tiny moves are not swipes', () => {
  expect(swipe(1, [200, 400])).toBe(NONE)
  expect(swipe(1, [200, 400], [185, 390])).toBe(NONE)
  expect(swipe(1, [200, 400], [200, 380])).toBe(NONE)
})

test('there is nothing before the first scene or after the last one', () => {
  expect(swipe(0, [200, 300], [200, 500])).toBe(NONE)
  expect(swipe(0, [100, 400], [300, 400])).toBe(NONE)
  expect(swipe(LAST, [200, 500], [200, 300])).toBe(NONE)
  expect(swipe(LAST, [300, 400], [100, 400])).toBe(NONE)
})
