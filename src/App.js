//import { createRoot } from 'react-dom/client';
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { Earth } from './assets/3d/earthflat/Earthflat';


import './App.css';
import { Suspense } from 'react';
import { PerspectiveCamera } from 'three';

import { Intro } from './components/intro'
import { CostaRica } from './components/costaRica'
import { Structure } from './components/structure'

function CameraHelper(){
  const camera = new PerspectiveCamera(75, 1.77, 0.1, 100 );
  return <group position={[0, 0, 30]}>
    <cameraHelper args={[camera]} />
  </group>
}

function App() {
  return (
    
    <div id="main" style={{width: '100vw', height: '100vh'}}>
      <Intro/>
      {/* <CostaRica/>       */}
      <Canvas camera={{fov: 75, near: 0.1, far: 100, position:[0, 15, 0]}}>
        {/* <OrbitControls /> */}
        <ambientLight intensity={0.5} />
        <spotLight position={[200, 300, -100]} angle={0.3} intensity={0.4}/>
        <spotLight position={[-200, -400, 100]} angle={1} intensity={0.2}/>
        <pointLight position={[-235, 235, 0]} intensity={0.2}/>
        <Suspense fallback={null}>
          <ScrollControls pages={3}>
            <Earth/>
          </ScrollControls>
        </Suspense>
        <CameraHelper/>
      </Canvas>      
    </div>
    
  );
}

export default App;
