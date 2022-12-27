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

export function MousePosition(){  
  const cam = useThree(state => state.camera)
  const [camDeviation, setCamDeviation] = useContext(CamDeviationContext)
  const [currentScene, setCurrentScene] = useContext(Context)

  function onResize() { 
    centerWidth = window.innerWidth/2
    centerHeight = window.innerHeight/2
    
    console.log('resize centerWidth', centerWidth);
    console.log('resize centerHeight', centerHeight);
  }

  
  const calculateDeviation = (event) => {
    const verticalDeviation = centerHeight - event.pageY
    const horizontalDeviation = event.pageX - centerWidth
    
    camHorizontalOffset = (2 * horizontalDeviation) / centerWidth 
    camVerticalOffset = (2 * verticalDeviation) / centerHeight
    
    const posUpdated = {
      x: camHorizontalOffset,
      y: camVerticalOffset,
      duration: 1
    }

    // if (currentScene !== 0){    
    
    //const deviation = [camHorizontalOffset, camVerticalOffset]
    //console.log('deviation', deviation);
      
      return (
        setCamDeviation([camHorizontalOffset, camVerticalOffset]),
        
        gsap.to(
          cam.position,
          posUpdated)
      )
    // } else {
    //   return setCamDeviation([camHorizontalOffset, camVerticalOffset])
    // }
  }

  useEffect(() => {
    
    if (currentScene !== 0){
      window.addEventListener('mousemove', calculateDeviation);
      window.addEventListener("resize", onResize);  
    }
    
    return () => {
      window.removeEventListener('mousemove', calculateDeviation);
    };
  }, [currentScene, calculateDeviation]);      

  return <></>
};