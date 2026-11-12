import React, { useCallback, useContext, useMemo, useRef, useState } from 'react'
import { trackEvent, trackPageView } from '../utils/analytics'

export const Context = React.createContext()
export const ContactContext = React.createContext()
export const CamDeviationContext = React.createContext()

// The contact dialog: whether it's open, and the control that opened it (the contact button or the
// "Let's talk!" link in the text), which gets the focus back when the dialog closes. Each opening is
// counted as a view of the page /contact, plus an event saying where it came from ('nav' or 'cta')
export function useContactState() {
  const [open, setOpen] = useState(false)
  const openerRef = useRef(null)

  const openContact = useCallback((opener, from) => {
    openerRef.current = opener || null
    setOpen(true)
    trackPageView('/contact', 'Contact')
    trackEvent('contact-open', from ? { from } : undefined)
  }, [])

  const closeContact = useCallback(() => setOpen(false), [])

  return useMemo(
    () => ({ open, openContact, closeContact, openerRef }),
    [open, openContact, closeContact]
  )
}

export const useContact = () => useContext(ContactContext)
