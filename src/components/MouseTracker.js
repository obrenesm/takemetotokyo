import React, { useEffect, useContext } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'

import { CamDeviationContext } from '../providers/contextProvider'

let centerWidth = window.innerWidth/2
let centerHeight = window.innerHeight/2

let camHorizontalOffset = 0
let camVerticalOffset = 0

export function MouseTracker({currentScene, children}){  
  const cam = useThree(state => state.camera)
  const [camDeviation, setCamDeviation] = useContext(CamDeviationContext)

  function onResize() { 
    centerWidth = window.innerWidth/2
    centerHeight = window.innerHeight/2
  }
  
  const calculateDeviation = (event) => {
    event.preventDefault()

    if (currentScene !== 0){
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
    window.addEventListener("resize", onResize);  
    
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