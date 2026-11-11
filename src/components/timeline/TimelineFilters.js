import React from 'react'
import { CATEGORIES } from '../../data/timelineData'
import { useLanguage } from '../../providers/languageProvider'
import { CategoryIcon } from './TimelineIcons'
import './Timeline.scss'

// Toggle buttons: "All" plus one per category, each with its color, icon and count.
// They double as the legend of the colors used in the timeline and the overview chart.
export function TimelineFilters({ selected, counts, total, shown, onToggle, onShowAll }) {
  const { t } = useLanguage()

  return (
    <>
      <span className="tl-filters__label" id="tl-filters-label">{t('timeline.filters.label')}</span>
      <div className="tl-chips" role="group" aria-labelledby="tl-filters-label">
        <button type="button" className="tl-chip tl-chip--all" aria-pressed={selected.length === 0} onClick={onShowAll}>
          <span>{t('timeline.filters.all')}</span>
          <span className="tl-chip__count">{total}</span>
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className={`tl-chip tl-cat--${category}`}
            aria-pressed={selected.includes(category)}
            onClick={() => onToggle(category)}
          >
            <CategoryIcon category={category} size={15} className="tl-chip__icon" />
            <span>{t(`timeline.categories.${category}`)}</span>
            <span className="tl-chip__count">{counts[category]}</span>
          </button>
        ))}
      </div>
      <p className="tl-filters__status" role="status">
        {t('timeline.filters.status', { shown, total })}
      </p>
    </>
  )
}
