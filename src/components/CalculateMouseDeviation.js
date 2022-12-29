import React, { useEffect, useRef, useState, useContext } from 'react'
import {scenes, camPositions} from '../data/scenesData'

import { Context } from './ContextProvider'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'

import { CamDeviationContext } from './ContextProvider'
//import { animate3D } from '../utils/utils'

let centerWidth = window.innerWidth/2
let centerHeight = window.innerHeight/2

let camHorizontalOffset = 0
let camVerticalOffset = 0

export function CalculateMousePosition({children}){  
  const cam = useThree(state => state.camera)
  const [camDeviation, setCamDeviation] = useContext(CamDeviationContext)
  const [currentScene, setCurrentScene] = useContext(Context)

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
      
      //return (
      setCamDeviation([camHorizontalOffset, camVerticalOffset])
      
      gsap.to(
        cam.position,
        posUpdated)
      //)
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