import React, { useEffect, useContext } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap/gsap-core'

import { CamDeviationContext } from '../providers/contextProvider'

// The middle of the window, measured on the first mouse move and again after a resize. Reading the
// window size while this module loads made the browser lay out the page in the middle of starting
// the app (Lighthouse's "Forced reflow")
let center = null

function getCenter() {
  if (!center) center = { width: window.innerWidth / 2, height: window.innerHeight / 2 }
  return center
}

function forgetCenter() {
  center = null
}

let camHorizontalOffset = 0
let camVerticalOffset = 0

export function MouseTracker({currentScene, children}){
  const cam = useThree(state => state.camera)
  const [, setCamDeviation] = useContext(CamDeviationContext)

  useEffect(() => {
    window.addEventListener('resize', forgetCenter)
    return () => window.removeEventListener('resize', forgetCenter)
  }, [])

  const calculateDeviation = (event) => {
    event.preventDefault()

    if (currentScene !== 0){
      const { width: centerWidth, height: centerHeight } = getCenter()
      const verticalDeviation = centerHeight - event.pageY
      const horizontalDeviation = event.pageX - centerWidth
      
      camHorizontalOffset = (2 * horizontalDeviation) / centerWidth 
      camVerticalOffset = (2 * verticalDeviation) / centerHeight
      
      const posUpdated = {
        x: camHorizontalOffset,
        y: camVerticalOffset,
        duration: 1
      }
      
      setCamDeviation([camHorizontalOffset, camVerticalOffset])
      
      gsap.to(
        cam.position,
        posUpdated)
    }
  }

  useEffect(() => {
    const canvas = document.querySelector('canvas')

    canvas.addEventListener('mousemove', calculateDeviation);

    return () => {
      canvas.removeEventListener('mousemove', calculateDeviation);
    };
  });      

  return (
  <group className='mob'>
    {children}
  </group>
  )
};