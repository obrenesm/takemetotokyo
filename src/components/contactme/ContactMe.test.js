import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Nav } from '../Nav'
import { Content } from '../Content'
import { ContactContext, useContactState } from '../../providers/contextProvider'
import { LanguageProvider } from '../../providers/languageProvider'

const ENDPOINT = 'https://contact.test/'

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

beforeEach(() => {
  process.env.REACT_APP_CONTACT_ENDPOINT = ENDPOINT
  process.env.REACT_APP_TURNSTILE_SITE_KEY = 'site-key'
  // The widget passes right away and hands over a token
  window.turnstile = {
    render: jest.fn((container, options) => {
      options.callback('token-1')
      return 'widget'
    }),
    remove: jest.fn(),
  }
  global.fetch = jest.fn()
})

afterEach(() => {
  delete process.env.REACT_APP_CONTACT_ENDPOINT
  delete process.env.REACT_APP_TURNSTILE_SITE_KEY
  delete window.turnstile
  delete global.fetch
  delete navigator.clipboard
  delete document.execCommand
  window.localStorage.clear()
})

// What Home sets up: the contact state, the nav with the dialog, and the scene texts
function ContactHarness({ scene = 0 }) {
  const contact = useContactState()
  return (
    <MemoryRouter>
      <ContactContext.Provider value={contact}>
        <Nav />
        <Content currentScene={scene} />
      </ContactContext.Provider>
    </MemoryRouter>
  )
}

const contactButton = () => screen.getByRole('button', { name: 'Contact Me' })

async function openContact() {
  render(<ContactHarness />)
  userEvent.click(contactButton())
  await waitFor(() => expect(window.turnstile.render).toHaveBeenCalled())
  return screen.getByRole('dialog', { name: "Let's talk!" })
}

function fillIn(dialog, { name = 'Ana', email = 'ana@example.com', message = ' Hi Oscar! ' } = {}) {
  if (name) userEvent.type(within(dialog).getByLabelText('Name'), name)
  if (email) userEvent.type(within(dialog).getByLabelText('Email'), email)
  if (message) userEvent.type(within(dialog).getByLabelText('Message'), message)
}

const send = (dialog) => userEvent.click(within(dialog).getByRole('button', { name: 'Send message' }))

test('the contact button opens a modal dialog and moves the focus into it', async () => {
  render(<ContactHarness />)
  expect(contactButton()).toHaveAttribute('aria-haspopup', 'dialog')
  expect(contactButton()).toHaveAttribute('aria-expanded', 'false')

  userEvent.click(contactButton())

  const dialog = screen.getByRole('dialog', { name: "Let's talk!" })
  expect(dialog).toHaveAttribute('open')
  expect(within(dialog).getByRole('heading', { level: 2, name: "Let's talk!" })).toHaveFocus()
  expect(contactButton()).toHaveAttribute('aria-expanded', 'true')
  expect(within(dialog).getByRole('button', { name: 'Close' })).toBeInTheDocument()
  await waitFor(() => expect(window.turnstile.render).toHaveBeenCalledTimes(1))
})

test('Close shuts the dialog and gives the focus back to the contact button', async () => {
  const dialog = await openContact()

  userEvent.click(within(dialog).getByRole('button', { name: 'Close' }))

  expect(dialog).not.toHaveAttribute('open')
  expect(contactButton()).toHaveFocus()
  expect(contactButton()).toHaveAttribute('aria-expanded', 'false')
  expect(window.turnstile.remove).toHaveBeenCalledWith('widget')
})

test('closing it the browser way (Esc) also gives the focus back', async () => {
  const dialog = await openContact()

  act(() => dialog.close())

  expect(contactButton()).toHaveFocus()
  expect(contactButton()).toHaveAttribute('aria-expanded', 'false')
})

test('"Let\'s talk!" in the text opens the dialog too, and gets the focus back', async () => {
  render(<ContactHarness scene={2} />)
  // A no-break space keeps it on one line
  const cta = screen.getByRole('button', { name: /^let's\stalk!$/i })

  userEvent.click(cta)
  const dialog = screen.getByRole('dialog', { name: "Let's talk!" })
  await waitFor(() => expect(window.turnstile.render).toHaveBeenCalled())
  userEvent.click(within(dialog).getByRole('button', { name: 'Close' }))

  expect(cta).toHaveFocus()
})

test('sending an empty form shows an error for each field and focuses the first one', async () => {
  const dialog = await openContact()

  send(dialog)

  const name = within(dialog).getByLabelText('Name')
  expect(name).toHaveFocus()
  expect(name).toHaveAttribute('aria-invalid', 'true')
  expect(name).toHaveAccessibleDescription('Please tell me your name.')
  expect(within(dialog).getByLabelText('Email')).toHaveAccessibleDescription('Please enter your email so I can reply.')
  expect(within(dialog).getByLabelText('Message')).toHaveAccessibleDescription('Please write a message.')
  expect(fetch).not.toHaveBeenCalled()
})

test('an error goes away as soon as the field is fixed', async () => {
  const dialog = await openContact()
  send(dialog)
  const name = within(dialog).getByLabelText('Name')

  userEvent.type(name, 'Ana')

  expect(name).not.toHaveAttribute('aria-invalid')
  expect(within(dialog).queryByText('Please tell me your name.')).not.toBeInTheDocument()
})

test('flags an email that does not look like one', async () => {
  const dialog = await openContact()
  fillIn(dialog, { email: 'ana@example' })

  send(dialog)

  const email = within(dialog).getByLabelText('Email')
  expect(email).toHaveFocus()
  expect(email).toHaveAccessibleDescription("That email doesn't look right. It should look like name@example.com.")
  expect(fetch).not.toHaveBeenCalled()
})

test('sends the message with the Turnstile token and announces that it went through', async () => {
  fetch.mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
  const dialog = await openContact()
  fillIn(dialog)

  send(dialog)

  await waitFor(() =>
    expect(within(dialog).getByRole('status')).toHaveTextContent("Thanks, Ana! I'll get back to you at ana@example.com soon.")
  )
  expect(within(dialog).getByRole('heading', { name: 'Message sent!' })).toHaveFocus()
  expect(within(dialog).queryByRole('button', { name: 'Send message' })).not.toBeInTheDocument()
  expect(fetch).toHaveBeenCalledWith(ENDPOINT, expect.objectContaining({ method: 'POST' }))
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
    name: 'Ana',
    email: 'ana@example.com',
    message: 'Hi Oscar!',
    language: 'en',
    'cf-turnstile-response': 'token-1',
  })
})

test('after a message was sent, the next time the dialog opens there is an empty form', async () => {
  fetch.mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
  const dialog = await openContact()
  fillIn(dialog)
  send(dialog)
  await within(dialog).findByRole('heading', { name: 'Message sent!' })

  userEvent.click(within(dialog).getByRole('button', { name: 'Close' }))
  userEvent.click(contactButton())
  await waitFor(() => expect(window.turnstile.render).toHaveBeenCalledTimes(2))

  expect(within(dialog).queryByRole('heading', { name: 'Message sent!' })).not.toBeInTheDocument()
  expect(within(dialog).getByRole('status')).toHaveTextContent('')
  expect(within(dialog).getByLabelText('Name')).toHaveValue('')
})

test('when sending fails the form stays, with an alert that offers the e-mail', async () => {
  fetch.mockResolvedValue({ ok: false, status: 502, json: async () => ({ ok: false, error: 'send' }) })
  const dialog = await openContact()
  fillIn(dialog)

  send(dialog)

  await waitFor(() =>
    expect(within(dialog).getByRole('alert')).toHaveTextContent("Sorry, your message couldn't be sent.")
  )
  expect(within(within(dialog).getByRole('alert')).getByRole('link', { name: 'oscar@take-me.jp' })).toHaveAttribute(
    'href',
    'mailto:oscar@take-me.jp'
  )
  expect(within(dialog).getByLabelText('Name')).toHaveValue('Ana')
  // The token was used: a new widget brings a new one for the next try
  await waitFor(() => expect(window.turnstile.render).toHaveBeenCalledTimes(2))
  expect(window.turnstile.remove).toHaveBeenCalledWith('widget')
})

test('asks to wait while the security check is still running', async () => {
  window.turnstile.render = jest.fn(() => 'widget')
  const dialog = await openContact()
  fillIn(dialog)

  send(dialog)

  expect(within(dialog).getByRole('alert')).toHaveTextContent("The security check isn't done yet.")
  expect(fetch).not.toHaveBeenCalled()
})

test('the button next to the e-mail copies it, and says so', async () => {
  const writeText = jest.fn().mockResolvedValue()
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
  const dialog = await openContact()

  userEvent.click(within(dialog).getByRole('button', { name: 'Copy email address' }))

  const result = await within(dialog).findByText('Copied!')
  expect(result).toHaveAttribute('aria-live', 'polite')
  expect(writeText).toHaveBeenCalledWith('oscar@take-me.jp')
})

test('without clipboard permission it copies the old way, keeping the focus on the button', async () => {
  const writeText = jest.fn().mockRejectedValue(new Error('Write permission denied'))
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
  let selected = null
  document.execCommand = jest.fn(() => {
    selected = document.activeElement.value
    return true
  })
  const dialog = await openContact()
  const button = within(dialog).getByRole('button', { name: 'Copy email address' })

  userEvent.click(button)

  expect(await within(dialog).findByText('Copied!')).toBeInTheDocument()
  expect(document.execCommand).toHaveBeenCalledWith('copy')
  expect(selected).toBe('oscar@take-me.jp')
  expect(button).toHaveFocus()
  // The hidden field is gone
  expect(dialog.querySelector('textarea[readonly]')).not.toBeInTheDocument()
})

test('says so when the e-mail could not be copied', async () => {
  // jsdom has neither the Clipboard API nor the copy command
  const dialog = await openContact()

  userEvent.click(within(dialog).getByRole('button', { name: 'Copy email address' }))

  expect(await within(dialog).findByText("Couldn't copy")).toBeInTheDocument()
})

test('the language can be switched without leaving the dialog', async () => {
  render(
    <LanguageProvider>
      <ContactHarness />
    </LanguageProvider>
  )
  userEvent.click(contactButton())
  const dialog = screen.getByRole('dialog', { name: "Let's talk!" })
  await waitFor(() => expect(window.turnstile.render).toHaveBeenCalled())
  userEvent.type(within(dialog).getByLabelText('Name'), 'Ana')

  userEvent.click(within(dialog).getByRole('button', { name: '日本語で表示' }))

  expect(dialog).toHaveAttribute('open')
  expect(screen.getByRole('dialog', { name: /お気軽に/ })).toBe(dialog)
  expect(within(dialog).getByRole('button', { name: 'View in English' })).toHaveFocus()
  // What was typed stays, and Turnstile comes back in Japanese
  expect(within(dialog).getByLabelText('お名前')).toHaveValue('Ana')
  await waitFor(() => expect(window.turnstile.render).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ language: 'ja' })))
})

test('without an endpoint or a Turnstile key it shows the e-mail and LinkedIn instead', () => {
  delete process.env.REACT_APP_CONTACT_ENDPOINT
  render(<ContactHarness />)

  userEvent.click(contactButton())

  const dialog = screen.getByRole('dialog', { name: "Let's talk!" })
  expect(within(dialog).queryByRole('textbox')).not.toBeInTheDocument()
  expect(within(dialog).getByRole('link', { name: 'oscar@take-me.jp' })).toHaveAttribute('href', 'mailto:oscar@take-me.jp')
  expect(within(dialog).getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
  expect(window.turnstile.render).not.toHaveBeenCalled()
})

test('under the form, a link leads to the journey timeline', async () => {
  const dialog = await openContact()
  expect(within(dialog).getByRole('link', { name: 'journey timeline' })).toHaveAttribute('href', '/journey')
})
