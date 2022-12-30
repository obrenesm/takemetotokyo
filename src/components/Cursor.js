import React, { useEffect, useRef, useState, useContext } from 'react'
import {scenes, camPositions} from '../data/scenesData'

import { Context } from './ContextProvider'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'

import { CamDeviationContext } from './ContextProvider'


export function Cursor({children}) {  
//   const cam = useThree(state => state.camera)
const [camDeviation, setCamDeviation] = useContext(CamDeviationContext)
const [currentScene, setCurrentScene] = useContext(Context)

const cursor = document.querySelector('.cursor-circle');
const links = document.querySelector('.text-container');

  function cursorMove(e) { 
    // console.log('moved', cursor);
    // console.log('e', e);
    //TODO: isn't following on the first load, after changing scene it works
    if (cursor) {
      cursor.style.transform = `translate3d(${e.pageX}px, ${e.pageY}px, 0)`;
    }
  }

  function options() {
//    useEffect(() => {
      if (currentScene === 0) {
        return 'Next'
      } else if (currentScene === scenes.length - 1) {
        return 'Return'
      } else {
        if (camDeviation[0] < 0) {
          return 'Back'
        } else if (camDeviation[0] >= 0) {
          return 'Siguiente'
        }
      }
   //});      
  }

  function mouseHover() {
    cursor.classList.add('.over-link')
  }


  //window.addEventListener('mouseover', mouseHover)

  window.addEventListener('mousemove', cursorMove)
  // window.removeEventListener('mousemove', cursorMove)
  
  return (
  <>
    <div className='cursor-container'>
      <div className='cursor-circle'>
        <span>{options()}</span>
      </div>
      {children}
    </div>
  </>
  )
};