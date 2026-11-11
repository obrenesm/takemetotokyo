import { CATEGORIES } from '../data/timelineData'

// 'YYYY-MM' -> { year: 2023, month: 11 }, 'YYYY' -> { year: 2023, month: null }
export function parseMonth(value) {
  const [year, month] = String(value).split('-').map(Number)
  return { year, month: month || null }
}

// A date as a fractional year (2023-11 -> 2023.83), for sorting and for the overview chart.
// 'end' moves it to the end of its month (or of its year when only the year is known),
// 'middle' to the middle: single moments known only by the year sit in the middle of it.
export function toYearFraction(value, edge = 'start') {
  const { year, month } = parseMonth(value)
  const offset = edge === 'end' ? 1 : edge === 'middle' ? 0.5 : 0
  return month ? year + (month - 1 + offset) / 12 : year + offset
}

export const currentYearFraction = (date = new Date()) => date.getFullYear() + date.getMonth() / 12

// Newest first. Items that start the same year keep their order in timelineData
export const sortNewestFirst = (items) =>
  items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => toYearFraction(b.item.start) - toYearFraction(a.item.start) || a.index - b.index)
    .map(({ item }) => item)

// [{ year: 2015, items: [...] }, ...] in the same order as the items
export function groupByYear(items) {
  const groups = []
  items.forEach((item) => {
    const { year } = parseMonth(item.start)
    const last = groups[groups.length - 1]
    if (last && last.year === year) last.items.push(item)
    else groups.push({ year, items: [item] })
  })
  return groups
}

// -- Dates as text ---------------------------------------------------------------------------
// Written by hand rather than with Intl's formatRange: in Japanese it gives "2015/01～2015/12"
// instead of the usual "2015年1月〜12月"

const monthName = (language, month) =>
  new Intl.DateTimeFormat(language, { month: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2000, month - 1, 1)))

function formatOne({ year, month }, language, { withYear = true } = {}) {
  if (language === 'ja') return `${withYear ? `${year}年` : ''}${month ? `${month}月` : ''}`
  if (!month) return String(year)
  return withYear ? `${monthName(language, month)} ${year}` : monthName(language, month)
}

// 'Nov 2023 – Feb 2026', 'Jan – Dec 2015', '2011 – 2015', 'Nov 2012'
// '2023年11月〜2026年2月', '2015年1月〜12月', '2011年〜2015年', '2012年11月'
export function formatPeriod(start, end, language) {
  const from = parseMonth(start)
  if (!end) return formatOne(from, language)

  const to = parseMonth(end)
  const separator = language === 'ja' ? '〜' : ' – '

  if (from.year === to.year && from.month && to.month) {
    if (from.month === to.month) return formatOne(from, language)
    return language === 'ja'
      ? `${formatOne(from, language)}${separator}${formatOne(to, language, { withYear: false })}`
      : `${formatOne(from, language, { withYear: false })}${separator}${formatOne(to, language)}`
  }

  return `${formatOne(from, language)}${separator}${formatOne(to, language)}`
}

// -- Filters -------------------------------------------------------------------------------
// The selection is a list of categories; an empty list means everything is shown.

// '?show=studies,work' -> ['work', 'studies'] (known categories only, in the usual order)
export function parseFilter(value) {
  const requested = (value || '').split(',').map((part) => part.trim().toLowerCase())
  const selected = CATEGORIES.filter((category) => requested.includes(category))
  return selected.length === CATEGORIES.length ? [] : selected
}

// The first category picked while everything is shown narrows the list to that category;
// the next ones are added to it. Removing the last one, or picking them all, shows everything
export function toggleCategory(selected, category) {
  const next = selected.includes(category)
    ? selected.filter((item) => item !== category)
    : CATEGORIES.filter((item) => item === category || selected.includes(item))

  return next.length === CATEGORIES.length ? [] : next
}

export const isCategoryShown = (selected, category) => selected.length === 0 || selected.includes(category)

// -- Overview chart layout --------------------------------------------------------------------
// Bars of the same lane share its width only while they overlap, like events in a calendar day:
// a bar is full width on its own and narrows to its side of the lane during an overlap (a bar
// keeps its side through it). Courses (minor items) stay out of the chart, the list has them.
// Returns, for each bar, its pieces in time order: { from, to } in years, { left, width } as
// fractions of the lane.
export function layoutLanes(items) {
  const layout = {}

  CATEGORIES.forEach((category) => {
    const bars = items
      .filter((item) => item.category === category && item.end && !item.minor)
      .map((item) => ({ id: item.id, from: toYearFraction(item.start), to: toYearFraction(item.end, 'end') }))
      .sort((a, b) => a.from - b.from)

    const trackEnds = []
    bars.forEach((bar) => {
      let track = trackEnds.findIndex((end) => end <= bar.from)
      if (track === -1) track = trackEnds.length
      trackEnds[track] = bar.to
      bar.track = track
    })

    const cuts = [...new Set(bars.flatMap((bar) => [bar.from, bar.to]))].sort((a, b) => a - b)

    bars.forEach((bar) => {
      const pieces = []
      for (let k = 0; k < cuts.length - 1; k++) {
        const from = cuts[k]
        const to = cuts[k + 1]
        if (from < bar.from || to > bar.to) continue
        const active = bars.filter((other) => other.from <= from && other.to >= to).sort((a, b) => a.track - b.track)
        const width = 1 / active.length
        const left = active.indexOf(bar) * width
        const last = pieces[pieces.length - 1]
        if (last && last.left === left && last.width === width) last.to = to
        else pieces.push({ from, to, left, width })
      }
      layout[bar.id] = pieces
    })
  })

  return layout
}
