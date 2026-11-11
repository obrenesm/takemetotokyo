import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Journey } from './Journey'
import { formatPeriod, layoutLanes, parseFilter, toggleCategory } from '../../utils/timeline'

let location
function LocationSpy() {
  location = useLocation()
  return null
}

function renderTimeline(url = '/journey') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/journey" element={<><Journey /><LocationSpy /></>} />
      </Routes>
    </MemoryRouter>
  )
}

// Hidden entries stay in the page to fold away, but out of the accessibility tree
const cardTitle = (name) => screen.queryByRole('heading', { level: 3, name })
const filter = (name) => within(screen.getByRole('group', { name: /show/i })).getByRole('button', { name })

test('shows every kind of activity by default', () => {
  renderTimeline()

  expect(cardTitle(/from new hire to cto/i)).toBeInTheDocument() // work
  expect(cardTitle(/turning a cycling team into a foundation/i)).toBeInTheDocument() // volunteering
  expect(cardTitle(/back to school, in japanese/i)).toBeInTheDocument() // studies
  expect(cardTitle(/racing for cartago/i)).toBeInTheDocument() // cycling
  expect(cardTitle(/seeing japan at bike speed/i)).toBeInTheDocument() // cycling, newest
  expect(screen.getByRole('img', { name: /route map: from tokyo to nagasaki/i })).toBeInTheDocument()
  expect(filter(/all/i)).toHaveAttribute('aria-pressed', 'true')
})

test('picking a category shows only that category', async () => {
  renderTimeline()

  await userEvent.click(filter(/studies/i))

  expect(cardTitle(/back to school, in japanese/i)).toBeInTheDocument()
  expect(cardTitle(/where i learned to build for the web/i)).toBeInTheDocument()
  expect(cardTitle(/from new hire to cto/i)).not.toBeInTheDocument()
  expect(cardTitle(/racing for cartago/i)).not.toBeInTheDocument()
  expect(filter(/studies/i)).toHaveAttribute('aria-pressed', 'true')
  expect(filter(/all/i)).toHaveAttribute('aria-pressed', 'false')
  expect(screen.getByRole('status')).toHaveTextContent('Showing 7 of 17')
  expect(location.search).toBe('?show=studies')
})

test('categories add up, and All shows everything again', async () => {
  renderTimeline()

  await userEvent.click(filter(/studies/i))
  await userEvent.click(filter(/work/i))

  expect(cardTitle(/from new hire to cto/i)).toBeInTheDocument()
  expect(cardTitle(/back to school, in japanese/i)).toBeInTheDocument()
  expect(cardTitle(/racing for cartago/i)).not.toBeInTheDocument()
  expect(location.search).toBe('?show=work%2Cstudies')

  await userEvent.click(filter(/all/i))

  expect(cardTitle(/racing for cartago/i)).toBeInTheDocument()
  expect(location.search).toBe('')
})

test('a shared link opens with its filter', () => {
  renderTimeline('/journey?show=volunteering')

  expect(cardTitle(/coaching the next generation/i)).toBeInTheDocument()
  expect(cardTitle(/back to school, in japanese/i)).not.toBeInTheDocument()
  expect(filter(/volunteering/i)).toHaveAttribute('aria-pressed', 'true')
})

test('details open and close', async () => {
  renderTimeline()

  const toggle = screen.getByRole('button', { name: /more: from new hire to cto/i })
  const details = document.getElementById(toggle.getAttribute('aria-controls'))
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(details).toHaveAttribute('aria-hidden', 'true')
  expect(details).toHaveTextContent(/two-year roadmap/i)

  await userEvent.click(toggle)

  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  expect(toggle).toHaveAccessibleName(/less: from new hire to cto/i)
  expect(details).not.toHaveAttribute('aria-hidden')
  expect(within(details).getByText(/two-year roadmap/i)).toBeInTheDocument()
})

describe('timeline helpers', () => {
  test('dates read naturally in each language', () => {
    expect(formatPeriod('2023-11', '2026-02', 'en')).toBe('Nov 2023 – Feb 2026')
    expect(formatPeriod('2015-01', '2015-12', 'en')).toBe('Jan – Dec 2015')
    expect(formatPeriod('2011', '2015', 'en')).toBe('2011 – 2015')
    expect(formatPeriod('2012-11', undefined, 'en')).toBe('Nov 2012')
    expect(formatPeriod('2023-11', '2026-02', 'ja')).toBe('2023年11月〜2026年2月')
    expect(formatPeriod('2015-01', '2015-12', 'ja')).toBe('2015年1月〜12月')
    expect(formatPeriod('2011', '2015', 'ja')).toBe('2011年〜2015年')
  })

  test('in the overview, bars only share their lane while they overlap, and courses stay out', () => {
    const layout = layoutLanes([
      { id: 'degree', category: 'studies', start: '2011-01', end: '2015-07' },
      { id: 'diploma', category: 'studies', start: '2015-01', end: '2015-12' },
      { id: 'course', category: 'studies', start: '2015', minor: true },
    ])
    expect(layout.degree.map((piece) => [piece.left, piece.width])).toEqual([[0, 1], [0, 0.5]])
    expect(layout.diploma.map((piece) => [piece.left, piece.width])).toEqual([[0.5, 0.5], [0, 1]])
    expect(layout.course).toBeUndefined()
  })

  test('filters ignore unknown categories and treat "all of them" as everything', () => {
    expect(parseFilter('studies,nope,WORK')).toEqual(['work', 'studies'])
    expect(parseFilter('work,volunteering,studies,cycling')).toEqual([])
    expect(parseFilter(null)).toEqual([])
    expect(toggleCategory([], 'studies')).toEqual(['studies'])
    expect(toggleCategory(['studies'], 'studies')).toEqual([])
    expect(toggleCategory(['work', 'volunteering', 'studies'], 'cycling')).toEqual([])
  })
})
