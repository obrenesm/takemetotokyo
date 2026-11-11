import React from 'react'

// Line icons on a 24px grid, drawn with currentColor
function Svg({ children, size = 16, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

const categoryPaths = {
  work: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7" />
      <path d="M3 12.5h18" />
    </>
  ),
  volunteering: (
    <path d="M12 20.5c-5-3.2-8.5-6.6-8.5-10.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 8.5 2.3c0 4-3.5 7.4-8.5 10.6z" />
  ),
  studies: (
    <>
      <path d="M2.5 9.5 12 5l9.5 4.5L12 14z" />
      <path d="M6.5 11.6v4.4c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.4" />
      <path d="M21.5 9.5v5.5" />
    </>
  ),
  cycling: (
    <>
      <circle cx="5.5" cy="16" r="3.5" />
      <circle cx="18.5" cy="16" r="3.5" />
      <path d="M5.5 16h7L9 9h6.5l3 7" />
      <path d="M5.5 16 9 9M12.5 16l3-7" />
      <path d="M9 9l.5-2.5M8 6.5h3M15.5 9l-1-3h2" />
    </>
  ),
}

export const CategoryIcon = ({ category, ...props }) => <Svg {...props}>{categoryPaths[category]}</Svg>

export const ChevronIcon = (props) => (
  <Svg {...props}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
)

export const ArrowLeftIcon = (props) => (
  <Svg {...props}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </Svg>
)

export const ArrowRightIcon = (props) => (
  <Svg {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
)

// A paper plane, for the "next stop" at the top of the timeline
export const PlaneIcon = (props) => (
  <Svg {...props}>
    <path d="M21 3 3.5 10.2l6.8 3 3 6.8z" />
    <path d="M21 3 10.3 13.2" />
  </Svg>
)
