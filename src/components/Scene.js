import React, { useEffect, useRef, useState, useContext } from 'react'
import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import {scenes} from '../data/scenesData'
//import { Scenario } from './3d/Scenario'

import { Context } from './ContextProvider'

export function Scene() {
  const scroll = useScroll()
  const [currentScene, setCurrentScene] = useContext(Context)

  function calcArrayIndex(array){
    const offset = scroll.offset;
    const isIn = (element) => (element.pos <= offset && element.end > offset)

    return Object.values(array).findIndex(isIn)
  }

  function updateScene(expected, current) {
    if (expected !== current){
      // console.log('currentScene', expected);
      // console.log('scroll.offset', scroll.offset);
      //return setCurrentScene(expected)      
    }
  }

  useFrame((state, delta) => {
    const expectedScene = calcArrayIndex(scenes)
    updateScene(expectedScene, currentScene)
  })

  return (
    <></>
  )
  
}