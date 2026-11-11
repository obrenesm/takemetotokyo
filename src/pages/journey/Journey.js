import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CATEGORIES, timelineItems } from '../../data/timelineData'
import { useLanguage } from '../../providers/languageProvider'
import { groupByYear, isCategoryShown, parseFilter, sortNewestFirst, toggleCategory } from '../../utils/timeline'
import { LanguageSwitch } from '../../components/languageswitch/LanguageSwitch'
import { TimelineFilters } from '../../components/timeline/TimelineFilters'
import { TimelineEntry, hiddenProps } from '../../components/timeline/TimelineEntry'
import { TimeMap } from '../../components/timeline/TimeMap'
import { ArrowLeftIcon, ArrowRightIcon, PlaneIcon } from '../../components/timeline/TimelineIcons'
import './Journey.scss'

const EMAIL = 'oscar@take-me.jp'
const LINKEDIN = 'https://www.linkedin.com/in/obrenesm'

const sortedItems = sortNewestFirst(timelineItems)
const yearGroups = groupByYear(sortedItems)
const counts = Object.fromEntries(
  CATEGORIES.map((category) => [category, timelineItems.filter((item) => item.category === category).length])
)

const scrollBehavior = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth'

// The timeline of everything I've done, with filters by kind (work, volunteering, studies, cycling).
// The filter lives in the URL (?show=studies,work) so a filtered view can be shared.
export function Journey() {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const showParam = searchParams.get('show')
  const selected = useMemo(() => parseFilter(showParam), [showParam])

  // Hovering a card highlights its bar in the overview chart and vice versa
  const [hover, setHover] = useState(null)
  const [inView, setInView] = useState(() => new Set())
  const [flash, setFlash] = useState(null)
  const [stuck, setStuck] = useState(false)

  const entryNodes = useRef(new Map())
  const sentinelRef = useRef(null)
  const filtersRef = useRef(null)
  const listRef = useRef(null)

  const isShown = (item) => isCategoryShown(selected, item.category)
  const shownCount = timelineItems.filter(isShown).length
  const current = useMemo(
    () => new Set(sortedItems.filter((item) => inView.has(item.id) && isCategoryShown(selected, item.category)).map((item) => item.id)),
    [inView, selected]
  )

  // The rest of the site is a fixed, full screen 3D scene: this page scrolls like a document
  useEffect(() => {
    document.body.classList.add('timeline-page')
    return () => document.body.classList.remove('timeline-page')
  }, [])

  // Runs after LanguageProvider sets the site title, so it wins on every language change
  useEffect(() => {
    document.title = t('timeline.title')
    return () => {
      document.title = t('meta.title')
    }
  }, [t])

  // The filters bar gets a border and a shadow once it sticks to the top
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(([entry]) => {
      setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  // Cards in the middle of the screen: their bars stay lit in the overview chart
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        setInView((previous) => {
          const next = new Set(previous)
          entries.forEach((entry) => {
            if (entry.isIntersecting) next.add(entry.target.dataset.id)
            else next.delete(entry.target.dataset.id)
          })
          return next
        })
      },
      { rootMargin: '-20% 0px -30% 0px' }
    )
    entryNodes.current.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!flash) return undefined
    const timer = setTimeout(() => setFlash(null), 1600)
    return () => clearTimeout(timer)
  }, [flash])

  const changeFilter = useCallback(
    (next) => {
      setSearchParams(
        (previous) => {
          const params = new URLSearchParams(previous)
          if (next.length) params.set('show', next.join(','))
          else params.delete('show')
          return params
        },
        { replace: true }
      )

      // Filtering from further down the page: back to the top of the list, otherwise the
      // folding cards leave the screen somewhere in the middle of the new results. A jump, not
      // a smooth scroll: the page gets shorter meanwhile and that would cut a smooth scroll short
      const list = listRef.current
      const bar = filtersRef.current
      if (list && bar && list.getBoundingClientRect().top < bar.getBoundingClientRect().bottom) {
        list.scrollIntoView({ block: 'start' })
      }
    },
    [setSearchParams]
  )

  const selectFromMap = useCallback((id) => {
    const node = entryNodes.current.get(id)
    if (!node) return
    node.scrollIntoView({ behavior: scrollBehavior(), block: 'center' })
    setFlash({ id, at: Date.now() })
  }, [])

  const entryRef = (id) => (node) => {
    if (node) entryNodes.current.set(id, node)
    else entryNodes.current.delete(id)
  }

  const hoverFrom = (source) => (id) => setHover(id ? { id, source } : null)

  return (
    <div className="tl-page">
      <header className="tl-wrap tl-topbar">
        <Link to="/" className="tl-topbar__home">
          <ArrowLeftIcon size={18} />
          <span>{t('timeline.home')}</span>
        </Link>
        <LanguageSwitch />
      </header>

      <main>
        <section className="tl-wrap tl-hero">
          <p className="tl-hero__kicker">{t('timeline.kicker')}</p>
          <h1 className="tl-hero__title">
            {t('timeline.headline.lead')}
            <span>{t('timeline.headline.highlight')}</span>
          </h1>
          <p className="tl-hero__intro">{t('timeline.intro')}</p>
        </section>

        <div ref={sentinelRef} className="tl-sentinel" aria-hidden="true" />
        <div ref={filtersRef} className={`tl-filters${stuck ? ' is-stuck' : ''}`}>
          <div className="tl-wrap tl-filters__inner">
            <TimelineFilters
              selected={selected}
              counts={counts}
              total={timelineItems.length}
              shown={shownCount}
              onToggle={(category) => changeFilter(toggleCategory(selected, category))}
              onShowAll={() => changeFilter([])}
            />
          </div>
        </div>

        <div className="tl-wrap tl-layout">
          <aside className="tl-layout__map">
            <TimeMap
              items={sortedItems}
              selected={selected}
              current={current}
              hover={hover}
              onHover={hoverFrom('map')}
              onSelect={selectFromMap}
            />
          </aside>

          <ol ref={listRef} className="tl-list" aria-label={t('timeline.listLabel')}>
            <li className="tl-now">
              <span className="tl-now__dot" aria-hidden="true" />
              <p className="tl-now__label">{t('timeline.now.label')}</p>
              <h2 className="tl-now__title">
                {t('timeline.now.title')}
                <PlaneIcon size={26} />
              </h2>
              <p className="tl-now__text">{t('timeline.now.text')}</p>
              <a className="tl-now__cta" href={`mailto:${EMAIL}`}>
                {t('timeline.now.cta')}
                <ArrowRightIcon size={18} />
              </a>
            </li>

            {yearGroups.map(({ year, items }) => {
              const groupHidden = !items.some(isShown)
              // A year with only courses gets no big number: their own date is enough
              const notesOnly = items.every((item) => item.minor)
              const classes = ['tl-year', notesOnly && 'tl-year--notes', groupHidden && 'is-hidden'].filter(Boolean).join(' ')
              return (
                <li key={year} className={classes} {...hiddenProps(groupHidden)}>
                  <div className="tl-year__clip">
                    <h2 className="tl-year__label">{year}</h2>
                    <ol className="tl-year__items">
                      {items.map((item) => (
                        <TimelineEntry
                          key={item.id}
                          item={item}
                          hidden={!isShown(item)}
                          linked={hover?.source === 'map' && hover.id === item.id}
                          flash={flash?.id === item.id}
                          onHover={hoverFrom('list')}
                          entryRef={entryRef(item.id)}
                        />
                      ))}
                    </ol>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </main>

      <footer className="tl-wrap tl-footer">
        <h2 className="tl-footer__title">{t('contact.title')}</h2>
        <p className="tl-footer__text">{t('timeline.footer.text')}</p>
        <div className="tl-footer__links">
          <a className="tl-button" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a className="tl-button tl-button--ghost" href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
        <Link to="/" className="tl-footer__back">
          <ArrowLeftIcon size={16} />
          {t('timeline.footer.back')}
        </Link>
      </footer>
    </div>
  )
}
