import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Home } from './pages/Home'
import { LanguageProvider } from './providers/languageProvider'

// The journey and the credits load only when they're opened: the home page doesn't need their
// code (the timeline, the route map data) or their styles to start
const Journey = lazy(() => import('./pages/journey/Journey').then((module) => ({ default: module.Journey })))
const Credits = lazy(() => import('./pages/credits/Credits').then((module) => ({ default: module.Credits })))

// The journey used to live at /resume: old links still land on it, with their filters
function ResumeRedirect() {
  const { search, hash } = useLocation()
  return <Navigate to={{ pathname: '/journey', search, hash }} replace />
}

function App() {
  return (
    <LanguageProvider>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/journey" element={<Journey/>} />
          <Route path="/resume" element={<ResumeRedirect/>} />
          <Route path="/credits" element={<Credits/>} />
        </Routes>
      </Suspense>
    </LanguageProvider>
  );
}

export default App;
