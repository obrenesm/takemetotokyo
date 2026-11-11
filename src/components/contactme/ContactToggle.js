import React from 'react'

// The look of the contact button: its text and an arrow that turns into an X while the dialog is
// open. The dialog's Close button draws the same thing in the same spot (see ContactMe.scss), so
// `decorative` hides the text there: that button is named "Close".
export function ContactToggleContent({ text, decorative = false }) {
  return (
    <>
      <span className='text-container' aria-hidden={decorative || undefined}>
        <span>{text}</span>
      </span>
      <svg width="30" height="30" viewBox="0 0 100 100" fill='none' aria-hidden="true" focusable="false">
        <path strokeWidth='6' className="line line1" d="M 5,29 H 80 C 80,29 94.5,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75,74 75,74 L 25,25" />
        <path strokeWidth='6' className="line line2" d="M 5,70 H 80 C 80,70 94.5,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75,25 75,25 L 25,74" />
      </svg>
    </>
  )
}
