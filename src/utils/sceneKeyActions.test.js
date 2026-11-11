import { getActionByKey } from './sceneKeyActions'
import { SCENE_ACTIONS } from './sceneActions'
import { scenes } from '../data/scenesData'

const { NEXT, BACK, NONE } = SCENE_ACTIONS
const LAST = scenes.length - 1

const press = (key, init) => new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init })

test('down and right go to the next scene, up and left go back', () => {
  expect(getActionByKey(0, press('ArrowDown'))).toBe(NEXT)
  expect(getActionByKey(1, press('ArrowRight'))).toBe(NEXT)
  expect(getActionByKey(LAST, press('ArrowUp'))).toBe(BACK)
  expect(getActionByKey(1, press('ArrowLeft'))).toBe(BACK)
})

test('there is nothing before the first scene or after the last one', () => {
  expect(getActionByKey(0, press('ArrowUp'))).toBe(NONE)
  expect(getActionByKey(0, press('ArrowLeft'))).toBe(NONE)
  expect(getActionByKey(LAST, press('ArrowDown'))).toBe(NONE)
  expect(getActionByKey(LAST, press('ArrowRight'))).toBe(NONE)
})

test('other keys do nothing', () => {
  expect(getActionByKey(1, press('Enter'))).toBe(NONE)
  expect(getActionByKey(1, press(' '))).toBe(NONE)
  expect(getActionByKey(1, press('PageDown'))).toBe(NONE)
})

test('arrows with a modifier are left to the browser', () => {
  for (const modifier of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey']) {
    expect(getActionByKey(1, press('ArrowRight', { [modifier]: true }))).toBe(NONE)
  }
})

test('holding an arrow down moves one scene only', () => {
  expect(getActionByKey(0, press('ArrowRight', { repeat: true }))).toBe(NONE)
})

test('an arrow somebody else already handled is left alone', () => {
  const event = press('ArrowRight')
  event.preventDefault()
  expect(getActionByKey(1, event)).toBe(NONE)
})

test('in a text field the arrows move the caret instead', () => {
  const field = document.createElement('textarea')
  document.body.append(field)
  let action
  field.addEventListener('keydown', (event) => { action = getActionByKey(1, event) })

  field.dispatchEvent(press('ArrowRight'))

  expect(action).toBe(NONE)
  field.remove()
})
