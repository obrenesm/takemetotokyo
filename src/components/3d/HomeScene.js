import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { MouseTracker } from '../MouseTracker'
import { Scenario } from './Scenario'

// The home page's 3D scene. three.js and the rest of the 3D code are most of the site's
// JavaScript, so this lives in a chunk of its own that Home loads once the intro headline is on
// screen (see pages/Home.js)
export function HomeScene({ currentScene, onClick }) {
  return (
    <Canvas camera={{ fov: 75, near: 0.1, far: 100, position: [-5, -4, 13] }} onClick={onClick}>
      <ambientLight intensity={0.5} />
      <spotLight position={[200, 300, -100]} angle={0.3} intensity={0.4} />
      <spotLight position={[-200, -400, 100]} angle={1} intensity={0.2} />
      <pointLight position={[-235, 235, 0]} intensity={0.2} />
      <Suspense fallback={null}>
        <MouseTracker currentScene={currentScene}>
          <Scenario currentScene={currentScene} />
        </MouseTracker>
      </Suspense>
    </Canvas>
  )
}
