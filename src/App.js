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
