import React, { useEffect, useRef, useState, useContext } from 'react'
//import * as THREE from 'three'
import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Airplane } from './3d/Airplane'
import { Earthh } from './3d/Earth'
import { Pin } from './3d/Pin'
import gsap from 'gsap'
import {scenes, data} from '../data/scenesData'
 
import { SceneContext } from './3d/Scenario'

//export const SceneContext = React.createContext()
console.log('data', data);
export function Scene(props) {
  const scroll = useScroll()

  let currentScene = 0;

  function calcObjIndex(obj){
    const offset = scroll.offset;
    const isIn = (element) => (element.pos <= offset && element.end > offset)

    return Object.values(obj).findIndex(isIn)
  }

  function calcArrayIndex(array){
    const offset = scroll.offset;
    const isIn = (element) => (element.pos <= offset && element.end > offset)

    return Object.values(array).findIndex(isIn)
  }

  // function animate3D(model, motion, obj, scene){

  //   const currentValues = obj[Object.keys(obj)[scene]]
  //   let pos = (({x, y, z, duration}) => ({x, y, z, duration}))(currentValues)  
  //   const selected = (motion === 'rotation') ? model.rotation : model.position

  //   return gsap.to(
  //     selected,
  //     pos)
  // }

  function updateScene(expected, current) {
    if (expected !== current){
      return currentScene = expected      
    }
  }

  useFrame((state, delta) => {
    //const expectedScene = calcObjIndex(scenes)
    const expectedScene = calcArrayIndex(data)

    if (expectedScene !== currentScene){
      updateScene(expectedScene, currentScene)
      console.log('currentScene', currentScene);

    }
  })



  return currentScene
}