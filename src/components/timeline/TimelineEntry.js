import React, { useState } from 'react'
import { useLanguage } from '../../providers/languageProvider'
import { formatPeriod } from '../../utils/timeline'
import { CategoryIcon, ChevronIcon } from './TimelineIcons'
import './Timeline.scss'

// Hidden items stay in the page so they can fold away with a transition: inert keeps their
// buttons out of the tab order and aria-hidden out of screen readers (and tests) meanwhile.
// React 18 has no inert prop, it's passed as a plain attribute.
export const hiddenProps = (hidden) => (hidden ? { inert: '', 'aria-hidden': true } : {})

export function TimelineEntry({ item, hidden, linked, flash, onHover, entryRef }) {
  const { t, language } = useLanguage()
  const [open, setOpen] = useState(false)
  const text = t(`timeline.items.${item.id}`)
  const detailsId = `tl-details-${item.id}`
  const hasDetails = Boolean(text.details || (item.path && text.path))

  const classes = [
    'tl-entry',
    `tl-cat--${item.category}`,
    item.minor && 'tl-entry--minor',
    hidden && 'is-hidden',
    linked && 'is-linked',
    flash && 'is-flash',
  ].filter(Boolean).join(' ')

  return (
    <li id={`tl-${item.id}`} className={classes} data-id={item.id} ref={entryRef} {...hiddenProps(hidden)}>
      <div className="tl-entry__clip">
        <div className="tl-entry__body">
          <span className="tl-entry__dot" aria-hidden="true" />
          <article
            className={`tl-card${item.minor ? ' tl-card--minor' : ''}`}
            onMouseEnter={() => onHover(item.id)}
            onMouseLeave={() => onHover(null)}
          >
            <div className="tl-card__meta">
              <span className="tl-card__date">{formatPeriod(item.start, item.end, language)}</span>
              <span className="tl-card__category">
                <CategoryIcon category={item.category} size={14} />
                {t(`timeline.categories.${item.category}`)}
              </span>
            </div>

            <h3 className="tl-card__title">{text.title}</h3>

            {(text.org || text.role) && (
              <p className="tl-card__role">
                {text.org && <span className="tl-card__org">{text.org}</span>}
                {text.org && text.role && <span className="tl-card__sep" aria-hidden="true">·</span>}
                {text.role && <span>{text.role}</span>}
              </p>
            )}

            {text.summary && <p className="tl-card__summary">{text.summary}</p>}

            {(text.tags || hasDetails) && (
              <div className="tl-card__foot">
                {text.tags && (
                  <ul className="tl-card__tags">
                    {text.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                )}
                {hasDetails && (
                  <button
                    type="button"
                    className="tl-card__toggle"
                    aria-expanded={open}
                    aria-controls={detailsId}
                    // Screen readers list every "More" button: the title tells them apart
                    aria-label={t(open ? 'timeline.lessAbout' : 'timeline.moreAbout').replace('{title}', text.title)}
                    onClick={() => setOpen((current) => !current)}
                  >
                    {open ? t('timeline.less') : t('timeline.more')}
                    <ChevronIcon size={16} />
                  </button>
                )}
              </div>
            )}

            {hasDetails && (
              <div id={detailsId} className={`tl-collapse${open ? ' is-open' : ''}`} {...hiddenProps(!open)}>
                <div className="tl-collapse__clip">
                  <div className="tl-details">
                    {item.path && text.path && (
                      <>
                        <h4 className="tl-details__title">{t('timeline.path')}</h4>
                        <ol className="tl-path">
                          {item.path.map((date, index) => (
                            <li key={date}>
                              <span className="tl-path__date">{formatPeriod(date, null, language)}</span>
                              <span>{text.path[index]}</span>
                            </li>
                          ))}
                        </ol>
                      </>
                    )}
                    {text.details && (
                      <ul className="tl-details__list">
                        {text.details.map((detail) => <li key={detail}>{detail}</li>)}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </li>
  )
}
