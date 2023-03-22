import React from 'react';
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Resume } from './pages/resume/Resume'
import { Credits } from './pages/credits/Credits'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/resume" element={<Resume/>} />
      <Route path="/credits" element={<Credits/>} />
    </Routes>
  );
}

export default App;
