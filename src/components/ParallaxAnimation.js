import React, { useEffect, useRef, useState, useContext } from 'react'
import {scenes, camPositions} from '../data/scenesData'

import { Context } from './ContextProvider'
import { CamDeviationContext } from './ContextProvider'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'

import { animate3D } from '../utils/utils'

let centerWidth = window.innerWidth/2
let centerHeight = window.innerHeight/2

let camHorizontalOffset = 0
let camVerticalOffset = 0

console.log('centerWidth', centerWidth);
console.log('centerHeight', centerHeight);

export function Parallax(){

  //const [currentScene, setCurrentScene] = useContext(Context)
  const [camDeviation, setCamDeviation] = useContext(CamDeviationContext)
  const cam = useThree(state => state.camera)


  // const calculateDeviation = (event) => {

  //   const verticalDeviation = centerHeight - event.pageY
  //   const horizontalDeviation = event.pageX - centerWidth

  //   camHorizontalOffset = (2 * horizontalDeviation) / centerWidth 
  //   camVerticalOffset = (2 * verticalDeviation) / centerHeight
  //useEffect(() => {
    //   window.addEventListener('mousemove', calculateDeviation);
    //   window.addEventListener("resize", onResize);
  
    //   return () => {
    //     window.removeEventListener('mousemove', calculateDeviation);
    //   };
    
    const posUpdated = {
      x: camDeviation[0],
      y: camDeviation[1],
      duration: 0
    }

    console.log('Parallax');
    
    gsap.to(
      cam.position,
      posUpdated)
      
    //}, [camDeviation, cam]);
//  }

  // useEffect(() => {
  //   window.addEventListener('mousemove', calculateDeviation);
  //   window.addEventListener("resize", onResize);

  //   return () => {
  //     window.removeEventListener('mousemove', calculateDeviation);
  //   };
  // }, []);
};