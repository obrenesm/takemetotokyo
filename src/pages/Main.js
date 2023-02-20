//import { createRoot } from 'react-dom/client';
// import * as THREE from 'three'
// import { useFrame, useThree } from '@react-three/fiber'
// import gsap from 'gsap'



import { Canvas } from '@react-three/fiber';
import React, { useRef, useState, useReducer } from 'react';
import { Scenario } from '../components/3d/Scenario';
import { Content } from '../components/Content';
import { Nav } from '../components/Nav';

import '../App.scss';
import { Suspense } from 'react';

import { CamDeviationContext, ContactContext, Context } from '../components/ContextProvider';
import { Cursor, followCursorEvent } from '../components/cursor/Cursor';
import { initialSceneState, sceneReducer } from '../reducers/scene.reducer';
import { getActionByCursor } from '../utils/scene-actions'
import { CalculateMousePosition } from '../components/CalculateMouseDeviation'

import { isTouchEnabled } from '../utils/utils'
import { onTouchStart, onTouchMove, onTouchEnd } from '../utils/scene-touch-actions'

export function Main() {
  const [currentScene, setCurrentScene] = useState(0);
  const [toggleCont, setToggleCont] = useState(false);
  const [camDeviation, setCamDeviation] = useState([0, 0]);
  const mouseRef = useRef();
  const [sceneState, dispatch] = useReducer(sceneReducer, initialSceneState);
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  return (
    <div id="main" style={{ width: '100vw', height: '100vh' }} 
      onMouseMove={isTouchEnabled() ? undefined : (e) => followCursorEvent(mouseRef)(e)}
      onTouchStart={(e) => onTouchStart(e, setTouchStart, setTouchEnd)}
      onTouchMove={(e) => onTouchMove(e, setTouchEnd)}
      onTouchEnd={(e) => {
        dispatch({ type: onTouchEnd(sceneState.currentScene, touchStart, touchEnd)})}}
      >
      <Context.Provider value={[currentScene, setCurrentScene]}>
        <CamDeviationContext.Provider value={[camDeviation, setCamDeviation]}>
          <ContactContext.Provider value={[toggleCont, setToggleCont]}>
            <Nav/>
            <Content currentScene={sceneState.currentScene} />
            {isTouchEnabled() ? undefined : <Cursor currentScene={sceneState.currentScene} ref={mouseRef} />}
            <Canvas camera={{ fov: 75, near: 0.1, far: 100, position: [-5, -4, 13] }}
            onClick={isTouchEnabled() ? undefined : (e) => dispatch({ type: getActionByCursor(sceneState.currentScene, camDeviation)})}
            >
              <ambientLight intensity={0.5} />
              <spotLight position={[200, 300, -100]} angle={0.3} intensity={0.4} />
              <spotLight position={[-200, -400, 100]} angle={1} intensity={0.2} />
              <pointLight position={[-235, 235, 0]} intensity={0.2} />
              <Suspense fallback={null}>
                <CalculateMousePosition currentScene={sceneState.currentScene}>
                  <Scenario currentScene={sceneState.currentScene} />
                </CalculateMousePosition>
              </Suspense>
            </Canvas>
          </ContactContext.Provider>
        </CamDeviationContext.Provider>
      </Context.Provider>
    </div>
  );
}
