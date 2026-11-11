import React, { useEffect, useRef, useState } from 'react'
import { japanRideMap } from '../../data/japanRideMap'
import './Timeline.scss'

const MAPS = { japanRide: japanRideMap }

const DRAW_SECONDS = 4.2

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// A ride on a dotted map of the coast, in the colors of the timeline. The first time the map is
// on screen the route draws itself, with a dot riding along it from the start to the finish.
// Markers and names are HTML on top of the SVG so they keep their size on small screens.
export function RouteMap({ id, labels }) {
  const map = MAPS[id]
  const ref = useRef(null)
  const riderRef = useRef(null)
  const [drawn, setDrawn] = useState(false)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      setDrawn(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setAnimated(true)
        setDrawn(true)
        riderRef.current?.beginElement?.()
        observer.disconnect()
      },
      { threshold: 0.5 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  if (!map) return null

  const routeId = `tl-route-${id}`
  const place = (key) => ({ left: `${map.places[key][0]}%`, top: `${map.places[key][1]}%` })

  return (
    <figure
      ref={ref}
      className={['tl-route', drawn && 'is-drawn', animated && 'is-animated'].filter(Boolean).join(' ')}
      style={{ '--tl-route-draw': `${DRAW_SECONDS}s` }}
    >
      {/* The places' percentages are of this box: the SVG alone, without the key below it */}
      <div className="tl-route__canvas">
        <svg viewBox={`0 0 ${map.width} ${map.height}`} role="img" aria-label={labels.label}>
          <defs>
            <pattern id={`${routeId}-dots`} width="9" height="9" patternUnits="userSpaceOnUse">
              <circle cx="4.5" cy="4.5" r="1.6" />
            </pattern>
            <pattern id={`${routeId}-dots-coarse`} width="15" height="15" patternUnits="userSpaceOnUse">
              <circle cx="7.5" cy="7.5" r="2.7" />
            </pattern>
          </defs>

          <path className="tl-route__land" d={map.land} />
          <path className="tl-route__dots" d={map.land} fill={`url(#${routeId}-dots)`} />
          <path className="tl-route__dots tl-route__dots--coarse" d={map.land} fill={`url(#${routeId}-dots-coarse)`} />

          {/* The whole route, faint, then the bright one that draws over it */}
          <path className="tl-route__trail" d={map.route} />
          <path id={routeId} className="tl-route__line" d={map.route} pathLength="1" />

          <circle className="tl-route__rider" r="7">
            <animateMotion
              ref={riderRef}
              dur={`${DRAW_SECONDS}s`}
              begin="indefinite"
              fill="freeze"
              calcMode="spline"
              keyPoints="0;1"
              keyTimes="0;1"
              keySplines="0.45 0 0.25 1"
            >
              <mpath href={`#${routeId}`} xlinkHref={`#${routeId}`} />
            </animateMotion>
          </circle>
        </svg>

        <span className="tl-route__place tl-route__place--start" style={place('start')} aria-hidden="true">
          <span className="tl-route__pin" />
          <span className="tl-route__name">
            <small>{labels.start}</small>
            {labels.startPlace}
          </span>
        </span>
        <span className="tl-route__place tl-route__place--turn" style={place('turn')} aria-hidden="true">
          <span className="tl-route__pin" />
          <span className="tl-route__name">{labels.turnPlace}</span>
        </span>
        <span className="tl-route__place tl-route__place--finish" style={place('finish')} aria-hidden="true">
          <span className="tl-route__pin" />
          <span className="tl-route__name">
            <small>{labels.finish}</small>
            {labels.finishPlace}
          </span>
        </span>
      </div>

      {/* Phones: the map is too small for names on it, they go in a key below */}
      <figcaption className="tl-route__legend" aria-hidden="true">
        <span className="tl-route__key tl-route__key--start">
          <span className="tl-route__pin" />
          {labels.startPlace}
          <small>{labels.start}</small>
        </span>
        <span className="tl-route__key tl-route__key--turn">
          <span className="tl-route__pin" />
          {labels.turnPlace}
        </span>
        <span className="tl-route__key tl-route__key--finish">
          <span className="tl-route__pin" />
          {labels.finishPlace}
          <small>{labels.finish}</small>
        </span>
      </figcaption>
    </figure>
  )
}
