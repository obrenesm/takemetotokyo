import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Home } from './pages/Home'
import { Journey } from './pages/journey/Journey'
import { Credits } from './pages/credits/Credits'
import { LanguageProvider } from './providers/languageProvider'

// The journey used to live at /resume: old links still land on it, with their filters
function ResumeRedirect() {
  const { search, hash } = useLocation()
  return <Navigate to={{ pathname: '/journey', search, hash }} replace />
}

function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/journey" element={<Journey/>} />
        <Route path="/resume" element={<ResumeRedirect/>} />
        <Route path="/credits" element={<Credits/>} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;
