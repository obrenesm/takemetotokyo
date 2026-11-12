import { Canvas } from '@react-three/fiber';
import React, { useEffect, useRef, useState, useReducer, Suspense } from 'react';
import { Scenario } from '../components/3d/Scenario';
import { Content } from '../components/Content';
import { Nav } from '../components/Nav';
import { MouseTracker } from '../components/MouseTracker'
import { Cursor, followCursorEvent } from '../components/cursor/Cursor';
import { CamDeviationContext, ContactContext, Context, useContactState } from '../providers/contextProvider';
import { initialSceneState, sceneReducer } from '../reducers/scene.reducer';
import { getActionByCursor, SCENE_ACTIONS } from '../utils/sceneActions'
import { getActionByKey } from '../utils/sceneKeyActions'
import { isTouchEnabled } from '../utils/utils'
import { onTouchStart, onTouchMove, onTouchEnd } from '../utils/sceneTouchActions'

import '../App.scss';

export function Home() {
  const [currentScene, setCurrentScene] = useState(0);
  const contact = useContactState();
  const [camDeviation, setCamDeviation] = useState([0, 0]);
  const mouseRef = useRef();
  const [sceneState, dispatch] = useReducer(sceneReducer, initialSceneState);
  const swipe = useRef(null)

  // The 3D canvas mounts one frame after the rest of the page. react-three-fiber measures its
  // container as soon as it mounts, reading the styles of every element up the page: mounted with
  // the page, that made the browser work out all its styles in the middle of the first render
  // (Lighthouse's "Forced reflow"). A frame later the browser has done that on its own, and the
  // models are still downloading anyway
  const [showScene, setShowScene] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShowScene(true))
    return () => cancelAnimationFrame(frame)
  }, [])

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
      >
      <Context.Provider value={[currentScene, setCurrentScene]}>
        <CamDeviationContext.Provider value={[camDeviation, setCamDeviation]}>
          <ContactContext.Provider value={contact}>
            <Nav/>
            <Content currentScene={sceneState.currentScene} />
            {isTouchEnabled() ? undefined : <Cursor currentScene={sceneState.currentScene} ref={mouseRef} />}
            {showScene && (
            <Canvas camera={{ fov: 75, near: 0.1, far: 100, position: [-5, -4, 13] }}
            onClick={isTouchEnabled() ? undefined : (e) => dispatch({ type: getActionByCursor(sceneState.currentScene, camDeviation)})}
            >
              <ambientLight intensity={0.5} />
              <spotLight position={[200, 300, -100]} angle={0.3} intensity={0.4} />
              <spotLight position={[-200, -400, 100]} angle={1} intensity={0.2} />
              <pointLight position={[-235, 235, 0]} intensity={0.2} />
              <Suspense fallback={null}>
                <MouseTracker currentScene={sceneState.currentScene}>
                  <Scenario currentScene={sceneState.currentScene} />
                </MouseTracker>
              </Suspense>
            </Canvas>
            )}
          </ContactContext.Provider>
        </CamDeviationContext.Provider>
      </Context.Provider>
    </div>
  );
}
