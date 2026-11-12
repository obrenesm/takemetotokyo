import { createEvent, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Home } from './Home'

// No WebGL in jsdom: the 3D scene stays out, the texts show which scene is on
jest.mock('../components/3d/HomeScene', () => ({ HomeScene: () => null }))

// jsdom 16 knows <dialog> but none of its methods: just what the browser does that matters here
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close() {
    if (!this.hasAttribute('open')) return
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
})

const activeScene = () => document.querySelector('section.active')?.id
const press = (key, target = document.body) => fireEvent.keyDown(target, { key })

// jsdom has no Touch objects, so the finger positions are set on the events by hand
function touch(type, [x, y]) {
  const main = document.getElementById('main')
  const event = createEvent[type](main)
  Object.defineProperty(event, 'targetTouches', { value: [{ clientX: x, clientY: y }] })
  fireEvent(main, event)
}

function swipe(from, to) {
  touch('touchStart', from)
  touch('touchMove', to)
  fireEvent.touchEnd(document.getElementById('main'))
}

test('the arrow keys go forward with down and right, and back with up and left', () => {
  render(<Home />)
  expect(activeScene()).toBe('intro')

  press('ArrowDown')
  expect(activeScene()).toBe('cr')
  press('ArrowRight')
  expect(activeScene()).toBe('jpn')
  press('ArrowRight')
  expect(activeScene()).toBe('jpn')

  press('ArrowUp')
  expect(activeScene()).toBe('cr')
  press('ArrowLeft')
  expect(activeScene()).toBe('intro')
  press('ArrowLeft')
  expect(activeScene()).toBe('intro')
})

test('the arrow keys leave the scene alone while the contact dialog is open', () => {
  render(<Home />)
  press('ArrowRight')

  userEvent.click(screen.getByRole('button', { name: 'Contact Me' }))
  press('ArrowRight', screen.getByRole('dialog'))
  press('ArrowLeft', screen.getByRole('dialog'))
  userEvent.click(screen.getByRole('button', { name: 'Close' }))

  expect(activeScene()).toBe('cr')
  press('ArrowRight')
  expect(activeScene()).toBe('jpn')
})

test('swiping up or left goes forward, down or right goes back', () => {
  render(<Home />)

  swipe([300, 400], [100, 420])
  expect(activeScene()).toBe('cr')
  swipe([200, 600], [210, 300])
  expect(activeScene()).toBe('jpn')

  swipe([100, 400], [300, 380])
  expect(activeScene()).toBe('cr')
  swipe([200, 300], [190, 600])
  expect(activeScene()).toBe('intro')
})
