//import { createRoot } from 'react-dom/client';
// import * as THREE from 'three'
// import { useFrame, useThree } from '@react-three/fiber'
// import gsap from 'gsap'



// import { Canvas } from '@react-three/fiber';
import React from 'react';

import { Route, Routes } from 'react-router-dom'
import { Main } from './pages/Main'
import { Resume } from './pages/resume/Resume'
import { Credits } from './pages/credits/Credits'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main/>} />
      <Route path="/resume" element={<Resume/>} />
      <Route path="/credits" element={<Credits/>} />
    </Routes>
  );
}

export default App;
