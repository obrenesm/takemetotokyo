import React, { useMemo } from 'react'
import { CATEGORIES } from '../../data/timelineData'
import { useLanguage } from '../../providers/languageProvider'
import { currentYearFraction, formatPeriod, isCategoryShown, layoutLanes, parseMonth, toYearFraction } from '../../utils/timeline'
import { CategoryIcon } from './TimelineIcons'
import './Timeline.scss'

const TICK_EVERY = 5

// The whole timeline at a glance, to scale: one lane per category, newest at the top, so the
// things that happened at the same time sit side by side. It's a pointer shortcut to the list
// (hover to see what a bar is, click to jump to it) and the list already has all its content,
// so it stays out of the accessibility tree and the tab order.
export function TimeMap({ items, selected, current, hover, onHover, onSelect }) {
  const { t, language } = useLanguage()
  const lanes = useMemo(() => layoutLanes(items), [items])
  const from = useMemo(() => Math.min(...items.map((item) => parseMonth(item.start).year)), [items])
  const now = useMemo(() => currentYearFraction(), [])
  const to = now + 0.4

  // Percentage from the top of the chart
  const y = (yearFraction) => ((to - yearFraction) / (to - from)) * 100

  const ticks = []
  for (let year = Math.ceil(from / TICK_EVERY) * TICK_EVERY; year < now; year += TICK_EVERY) ticks.push(year)

  const hasCurrent = current.size > 0
  const tooltipItem = hover?.source === 'map' ? items.find((item) => item.id === hover.id) : null

  const markProps = (item) => ({
    className: [
      'tl-map__mark',
      item.end ? 'tl-map__bar' : 'tl-map__dot',
      current.has(item.id) && 'is-current',
      hover?.id === item.id && 'is-hovered',
    ].filter(Boolean).join(' '),
    onMouseEnter: () => onHover(item.id),
    onMouseLeave: () => onHover(null),
    onClick: () => onSelect(item.id),
  })

  const renderMark = (item) => {
    if (!item.end) {
      return <div key={item.id} {...markProps(item)} style={{ top: `${y(toYearFraction(item.start, 'middle'))}%` }} />
    }

    const start = toYearFraction(item.start)
    const end = toYearFraction(item.end, 'end')
    const pieces = lanes[item.id]
    const span = end - start
    const vertical = (from, to) => ({ top: ((end - to) / span) * 100, height: ((to - from) / span) * 100 })

    // A bar that never shares its lane can show its roles instead: one block per role, 2px of
    // background between them (1px less at each end; a short role is still a sliver)
    const roles = pieces.length === 1 && item.path?.length > 1
      ? item.path.map((date, index, path) => {
        const { top, height } = vertical(toYearFraction(date), index < path.length - 1 ? toYearFraction(path[index + 1]) : end)
        return { top: `calc(${top}% + 1px)`, height: `max(2px, calc(${height}% - 2px))`, left: '0%', width: '100%', className: 'tl-map__piece is-role' }
      })
      : null

    // Otherwise the pieces: full width, or half of the lane (2px apart) while it overlaps another
    const blocks = roles || pieces.map((piece, index) => {
      const { top, height } = vertical(piece.from, piece.to)
      const side = piece.width < 1
      return {
        top: `${top}%`,
        height: `${height}%`,
        left: side && piece.left > 0 ? `calc(${piece.left * 100}% + 1px)` : `${piece.left * 100}%`,
        width: side ? `calc(${piece.width * 100}% - 1px)` : '100%',
        className: ['tl-map__piece', index === 0 && 'is-first', index === pieces.length - 1 && 'is-last'].filter(Boolean).join(' '),
      }
    })

    return (
      <div key={item.id} {...markProps(item)} style={{ top: `${y(end)}%`, height: `${y(start) - y(end)}%` }}>
        {blocks.map(({ className, ...style }, index) => <span key={index} className={className} style={style} />)}
      </div>
    )
  }

  const tooltipTop = tooltipItem
    ? tooltipItem.end
      ? (y(toYearFraction(tooltipItem.end, 'end')) + y(toYearFraction(tooltipItem.start))) / 2
      : y(toYearFraction(tooltipItem.start, 'middle'))
    : 0

  return (
    <div className={`tl-map${hasCurrent ? ' has-current' : ''}`} aria-hidden="true">
      <p className="tl-map__title">{t('timeline.overview')}</p>

      <div className="tl-map__head">
        {CATEGORIES.map((category, index) => (
          <span
            key={category}
            className={`tl-map__lane-icon tl-cat--${category}${isCategoryShown(selected, category) ? '' : ' is-off'}`}
            style={{ '--lane': index }}
          >
            <CategoryIcon category={category} size={14} />
          </span>
        ))}
      </div>

      <div className="tl-map__plot">
        <div className="tl-map__tick tl-map__tick--now" style={{ top: `${y(now)}%` }}>
          <span>{t('timeline.now.label')}</span>
        </div>
        {ticks.map((year) => (
          <div key={year} className="tl-map__tick" style={{ top: `${y(year)}%` }}>
            <span>{year}</span>
          </div>
        ))}

        {CATEGORIES.map((category, index) => (
          <div
            key={category}
            className={`tl-map__lane tl-cat--${category}${isCategoryShown(selected, category) ? '' : ' is-off'}`}
            style={{ '--lane': index }}
          >
            {items.filter((item) => item.category === category && !item.minor).map(renderMark)}
          </div>
        ))}

        {tooltipItem && (
          <div className={`tl-map__tooltip tl-cat--${tooltipItem.category}`} style={{ top: `${tooltipTop}%` }}>
            <strong>{formatPeriod(tooltipItem.start, tooltipItem.end, language)}</strong>
            <span>{t(`timeline.items.${tooltipItem.id}.title`)}</span>
            {t(`timeline.items.${tooltipItem.id}`).org && (
              <span className="tl-map__tooltip-org">{t(`timeline.items.${tooltipItem.id}.org`)}</span>
            )}
          </div>
        )}
      </div>

      <p className="tl-map__hint">{t('timeline.overviewHint')}</p>
    </div>
  )
}
