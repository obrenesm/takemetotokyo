import React, { lazy, useEffect, useRef, useState, useReducer, Suspense } from 'react';
import { Content } from '../components/Content';
import { Nav } from '../components/Nav';
import { Cursor, followCursorEvent } from '../components/cursor/Cursor';
import { CamDeviationContext, ContactContext, Context, useContactState } from '../providers/contextProvider';
import { initialSceneState, sceneReducer } from '../reducers/scene.reducer';
import { getActionByCursor, SCENE_ACTIONS } from '../utils/sceneActions'
import { getActionByKey } from '../utils/sceneKeyActions'
import { isTouchEnabled } from '../utils/utils'
import { onTouchStart, onTouchMove, onTouchEnd } from '../utils/sceneTouchActions'

import '../App.scss';

const HomeScene = lazy(() => import('../components/3d/HomeScene').then((module) => ({ default: module.HomeScene })))

// The browser paints the headline in full a frame or two after its fade-in ends: the scene waits
// that long, so its download doesn't start before that paint
const SCENE_DELAY_AFTER_INTRO = 100
// In case the fade-in never ends (it isn't running, the tab is hidden...): the scene loads anyway
const SCENE_FALLBACK_DELAY = 1500

export function Home() {
  const [currentScene, setCurrentScene] = useState(0);
  const contact = useContactState();
  const [camDeviation, setCamDeviation] = useState([0, 0]);
  const mouseRef = useRef();
  const [sceneState, dispatch] = useReducer(sceneReducer, initialSceneState);
  const swipe = useRef(null)

  // The 3D scene loads once the intro headline has faded in. The headline is the page's Largest
  // Contentful Paint, which Chrome records when that fade-in ends: loading three.js and the models
  // before it put all that downloading and work ahead of it (slow on phones). Mounting it after the
  // first render also keeps react-three-fiber from measuring the page in the middle of laying it
  // out (Lighthouse's "Forced reflow")
  const [introDone, setIntroDone] = useState(false)
  const [showScene, setShowScene] = useState(false)

  useEffect(() => {
    if (showScene) return undefined
    const timer = setTimeout(() => setShowScene(true), introDone ? SCENE_DELAY_AFTER_INTRO : SCENE_FALLBACK_DELAY)
    return () => clearTimeout(timer)
  }, [showScene, introDone])

  const onAnimationEnd = (event) => {
    if (event.animationName === 'intro') setIntroDone(true)
  }

  // The arrow keys move between scenes too, except while the contact dialog is open (it's modal)
  useEffect(() => {
    if (contact.open) return undefined

    const onKeyDown = (event) => {
      const action = getActionByKey(sceneState.currentScene, event)
      if (action === SCENE_ACTIONS.NONE) return
      event.preventDefault()
      dispatch({ type: action })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [contact.open, sceneState.currentScene])

  return (
    <div id="main" style={{ width: '100vw', height: '100vh' }}
      onMouseMove={isTouchEnabled() ? undefined : (e) => followCursorEvent(mouseRef)(e)}
      onTouchStart={!contact.open ? (e) => onTouchStart(e, swipe) : null}
      onTouchMove={!contact.open ? (e) => onTouchMove(e, swipe) : null}
      onTouchEnd={!contact.open ? () => {
        dispatch({ type: onTouchEnd(sceneState.currentScene, swipe)})} : null}
      onAnimationEnd={introDone ? undefined : onAnimationEnd}
      >
      <Context.Provider value={[currentScene, setCurrentScene]}>
        <CamDeviationContext.Provider value={[camDeviation, setCamDeviation]}>
          <ContactContext.Provider value={contact}>
            <Nav/>
            <Content currentScene={sceneState.currentScene} />
            {isTouchEnabled() ? undefined : <Cursor currentScene={sceneState.currentScene} ref={mouseRef} />}
            {showScene && (
              <Suspense fallback={null}>
                <HomeScene
                  currentScene={sceneState.currentScene}
                  onClick={isTouchEnabled() ? undefined : () => dispatch({ type: getActionByCursor(sceneState.currentScene, camDeviation)})}
                />
              </Suspense>
            )}
          </ContactContext.Provider>
        </CamDeviationContext.Provider>
      </Context.Provider>
    </div>
  );
}
