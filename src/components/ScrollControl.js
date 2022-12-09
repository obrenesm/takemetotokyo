import React, { useEffect, useRef, useState, useContext } from 'react'
import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import {scenes} from '../data/scenesData'

import { Context } from './ContextProvider'

const allPositions = scenes.map((element) => element.pos);

export function ScrollControl() {
  const scroll = useScroll()
  const [currentScene, setCurrentScene] = useContext(Context)

  console.log('allPositions', allPositions);

  function calcNearestScene(){
    const offset = scroll.offset;
    const output = allPositions.reduce((prev, curr) => Math.abs(curr - offset) < Math.abs(prev - offset) ? curr : prev);
 //   console.log('output', output);

    return output
  }


  useFrame((state, delta) => {
//    const offset = scroll.offset;
    const curr = scenes[currentScene].pos
    //console.log('curr', curr);
    const near = calcNearestScene()

    if (curr !== near) {
      console.log('curr', curr);
      console.log('near', near);
      // document.scroll({
      //   top: 1000,
      //   left: 0,
      //   behavior: 'smooth'
      // });
      console.log('HERE');
    }
  })

  return (
    <></>
  )
  
}