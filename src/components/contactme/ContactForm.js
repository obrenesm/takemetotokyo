import React, { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../providers/languageProvider'
import {
  CONTACT_EMAIL,
  CONTACT_FIELDS,
  CONTACT_LIMITS,
  normalizeContact,
  sendContactMessage,
  validateContact,
} from '../../utils/contactForm'
import { Turnstile } from './Turnstile'

const EMPTY = { name: '', email: '', message: '' }

const INPUTS = {
  name: { type: 'text', autoComplete: 'name' },
  email: { type: 'email', autoComplete: 'email', autoCapitalize: 'off', spellCheck: false },
  message: { multiline: true, rows: 6 },
}

// One column: name, e-mail, message, the Turnstile check and the button. Errors show up under each
// label when you send; a field with an error is checked again as you fix it.
export function ContactForm({ open, endpoint, siteKey }) {
  const { t, language } = useLanguage()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  // { name, email } once the message went through
  const [sent, setSent] = useState(null)
  // A problem with the whole form: 'verifying' | 'verification' | 'unavailable' | 'failed'
  const [alert, setAlert] = useState(null)
  const [token, setToken] = useState(null)
  // Tokens are single use: a new key renders a new widget, which gets a new token
  const [widgetKey, setWidgetKey] = useState(0)
  const [turnstileFailed, setTurnstileFailed] = useState(false)

  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const messageRef = useRef(null)
  const fieldRefs = { name: nameRef, email: emailRef, message: messageRef }
  const sentTitleRef = useRef(null)
  const sentSeen = useRef(false)

  // The widget only lives while the dialog is open, so a closed dialog has no token
  useEffect(() => {
    if (open) return
    setToken(null)
    setTurnstileFailed(false)
    setAlert(null)
  }, [open])

  // After sending, the focus goes to the confirmation (the details are announced by the status below)
  useEffect(() => {
    if (sent && open) sentTitleRef.current?.focus()
  }, [sent, open])

  // Once the confirmation was seen, closing the dialog leaves an empty form for next time
  useEffect(() => {
    if (!sent) return
    if (open) {
      sentSeen.current = true
    } else if (sentSeen.current) {
      sentSeen.current = false
      setSent(null)
      setValues(EMPTY)
      setErrors({})
      setWidgetKey((key) => key + 1)
    }
  }, [open, sent])

  const setFieldError = (field, problem) =>
    setErrors((current) => {
      const { [field]: previous, ...rest } = current
      return problem ? { ...rest, [field]: problem } : rest
    })

  function handleChange(event) {
    const { name, value } = event.target
    const next = { ...values, [name]: value }
    setValues(next)
    // Fixed: the error goes away right away (a new error waits for the blur or the next send)
    if (errors[name] && !validateContact(next)[name]) setFieldError(name, null)
  }

  function handleBlur(event) {
    const { name } = event.target
    if (errors[name]) setFieldError(name, validateContact(values)[name])
  }

  function focusFirstError(found) {
    const field = CONTACT_FIELDS.find((name) => found[name])
    if (field) fieldRefs[field].current.focus()
    return Boolean(field)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (sending) return

    const found = validateContact(values)
    setErrors(found)
    if (focusFirstError(found)) {
      setAlert(null)
      return
    }

    if (!token) {
      setAlert(turnstileFailed ? 'unavailable' : 'verifying')
      return
    }

    const message = normalizeContact(values)
    setSending(true)
    setAlert(null)
    const result = await sendContactMessage(endpoint, { ...message, language, token })
    setSending(false)

    if (result.ok) {
      setSent({ name: message.name, email: message.email })
      return
    }

    // The server checks the fields before the token, so the token is still good
    if (result.error === 'invalid') {
      setErrors(result.fields)
      if (focusFirstError(result.fields)) return
    }

    setToken(null)
    setWidgetKey((key) => key + 1)
    setAlert(result.error === 'verification' ? 'verification' : 'failed')
  }

  function errorText(field, problem) {
    if (problem === 'tooLong') return t('contact.form.errors.tooLong', { max: CONTACT_LIMITS[field].toLocaleString('en') })
    if (problem === 'invalid' && field === 'email') return t('contact.form.errors.emailInvalid')
    return t(`contact.form.errors.${field}Required`)
  }

  function renderField(field) {
    const id = `contact-${field}`
    const errorId = `${id}-error`
    const problem = errors[field]
    const { multiline, ...inputProps } = INPUTS[field]
    const props = {
      ...inputProps,
      id,
      name: field,
      ref: fieldRefs[field],
      value: values[field],
      onChange: handleChange,
      onBlur: handleBlur,
      required: true,
      maxLength: CONTACT_LIMITS[field],
      'aria-invalid': problem ? true : undefined,
      'aria-describedby': problem ? errorId : undefined,
    }

    return (
      <div className='contact-field' key={field}>
        <label htmlFor={id}>{t(`contact.form.${field}`)}</label>
        {/* Between the label and the field, so it's in view while you type, keyboard open or zoomed in */}
        {problem && <p className='contact-error' id={errorId}>{errorText(field, problem)}</p>}
        {multiline ? <textarea {...props} /> : <input {...props} />}
      </div>
    )
  }

  const emailLink = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>

  return (
    <div className='contact-form-area'>
      {sent && (
        <h3 className='contact-sent-title' ref={sentTitleRef} tabIndex={-1}>
          <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="10.5" />
            <path d="M7.5 12.5l3 3 6-6.5" />
          </svg>
          {t('contact.form.sent.title')}
        </h3>
      )}
      {/* Always in the page, so screen readers announce the text when it shows up */}
      <div className='contact-sent-text' role='status'>
        {sent && (
          <p>
            {t('contact.form.sent.text', {
              name: sent.name,
              email: <span className='contact-sent-email'>{sent.email}</span>,
            })}
          </p>
        )}
      </div>

      {!sent && (
        <form className='contact-form' noValidate onSubmit={handleSubmit}>
          <p className='contact-form-intro'>{t('contact.form.intro')}</p>
          {CONTACT_FIELDS.map(renderField)}

          {open && (
            <Turnstile
              key={widgetKey}
              siteKey={siteKey}
              language={language}
              onToken={(next) => {
                setToken(next)
                setTurnstileFailed(false)
                setAlert((current) => (current === 'verifying' || current === 'verification' ? null : current))
              }}
              onExpire={() => setToken(null)}
              onFail={() => {
                setTurnstileFailed(true)
                setAlert('unavailable')
              }}
            />
          )}

          <div className='contact-actions'>
            <div className='contact-alert' role='alert'>
              {alert && <p>{t(`contact.form.alerts.${alert}`, { email: emailLink })}</p>}
            </div>
            {/* aria-disabled instead of disabled: a disabled button would drop the focus */}
            <button type='submit' className='contact-submit' aria-disabled={sending || undefined}>
              {sending ? t('contact.form.sending') : t('contact.form.submit')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
