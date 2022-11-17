import React, { useEffect, useRef, useState, useContext } from 'react'
//import * as THREE from 'three'
import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { camPositions, planetRotations } from './../../data/scenesData'
import { Airplane } from './Airplane'
import { Earthh } from './Earth'
import { Pin } from './Pin'
import gsap from 'gsap'

export function Scenario(props) {
  //const scroll = useScroll()
  const planet = useRef(null)
  //const currentScene = props.scene;

  // const camPositions = {
  //   camIntro: {
  //     x: -5, 
  //     y: -4, 
  //     z: 13, 
  //     duration: 2,
  //     pos: 0,
  //     end: 0.5
  //   },
  //   camCR: {
  //     x:0, 
  //     y:0, 
  //     z:23, 
  //     duration: 2,
  //     pos: 0.5,
  //     end: 0.7
  //   },
  //   camJpn: {
  //     x:0, 
  //     y:0, 
  //     z:25, 
  //     duration: 2,
  //     pos: 1,
  //     end: 1.1
  //   }
  // }

  // const planetRotations = {
  //   rotIntro: {
  //     x: Math.PI / 35,
  //     y: Math.PI / 1.5,
  //     z: 0,
  //     duration: 2,
  //     pos: 0,
  //     end: 0.5
  //   },
  //   rotCR: {
  //     x: Math.PI / 22,
  //     y: Math.PI / 2.3,
  //     z: 0,
  //     duration: 2,
  //     pos: 0.5,
  //     end: 1
  //   },
  //   rotJpn: {
  //     x: Math.PI / 6,
  //     y: -Math.PI / 1.32,
  //     z: 0,
  //     duration: 2,
  //     pos: 1,
  //     end: 1.1
  //   }
  // }

  // const scenes = {
  //   Intro: { 
  //     pos: 0,
  //     end: 0.25
  //   },
  //   CR: { 
  //     pos: 0.25,
  //     end: 0.75
  //   },
  //   Jpn: { 
  //     pos: 0.75,
  //     end: 1
  //   }
  // }

  // function calcObjIndex(obj){
  //   const offset = scroll.offset;
  //   const isIn = (element) => (element.pos <= offset && element.end > offset)

  //   return Object.values(obj).findIndex(isIn)
  // }

  function animate3D(model, motion, obj, scene){
    const currentValues = obj[Object.keys(obj)[scene]]
    let pos = (({x, y, z, duration}) => ({x, y, z, duration}))(currentValues)  
    const selected = (motion === 'rotation') ? model.rotation : model.position

    return gsap.to(
      selected,
      pos)
  }
  
  useFrame((state, delta) => {
    // const expectedScene = calcObjIndex(scenes)
    const globe = planet.current
    const cam = state.camera

    cam.lookAt(0, 0, 0)

    if (!!planet){
      animate3D(globe, 'rotation', planetRotations, props.scene)
      animate3D(cam, 'position', camPositions, props.scene)
    }
  })

  return (
    <>
      <Airplane position={[-0.2, 0.6, 14]}/>
      <group scale={1.6} ref={planet} rotation={[Math.PI / 35, Math.PI / 1.5, 0]}>
        <Earthh />
        <Pin pos={[-8.6, 1.5, 1]} rot={[0, 0, Math.PI / 2]} />
        <Pin pos={[4.7, 5.4, -5.5]} rot={[-Math.PI / 2, -Math.PI / 3.2, -Math.PI / 3.0]} />
      </group>
    </>
  )
}