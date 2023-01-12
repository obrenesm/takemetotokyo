import React, { useEffect, useRef, useState, useContext } from 'react'
//import * as THREE from 'three'
import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { camPositions, planetRotations } from './../../data/scenesData'
import { Airplane } from './Airplane'
import { Earthh } from './Earth'
import { Pin } from './Pin'
import gsap from 'gsap'

import { Context } from '../ContextProvider'
import { CamDeviationContext } from '../ContextProvider'

//import { MousePosition } from '../MousePosition'


export function Scenario({currentScene, ...props}) {
  const planet = useRef(null)
  const cam = useThree(state => state.camera)

  // const [currentScene, setCurrentScene] = useContext(Context)
  const [camDeviation, setCamDeviation] = useContext(CamDeviationContext)


  function animate3D(model, motion, obj, scene){
    const currentValues = obj[Object.keys(obj)[scene]]
    let pos = (({x, y, z, duration}) => ({x, y, z, duration}))(currentValues)  
    const selected = (motion === 'rotation') ? model.rotation : model.position

    if (motion === 'position' && scene !== 0) {
      Object.assign(pos, {x: /*camDeviation[0] +*/ pos['x'], y: /*camDeviation[1] + */pos['y']})
    }

    return gsap.to(
      selected,
      pos)
  }
  
  useFrame((state, delta) => {
    // const cam = state.camera

    // TODO:
    // figure out how to access cam variable from the useEffect, 
    // that way it's not set it and animated every frame

    cam.lookAt(0, 0, 0)

    // TODO:
    // Why 'message' & 'requestAnimationFrame' took more once the animate3D was moved into useEffect?
    // is it related at all? prev it was 150/250 now ~500 to 1000

  })

  useEffect(() => {
    //const cam = RootState.camera
    //cam.lookAt(0, 0, 0)

    if (!!planet){
      animate3D(planet.current, 'rotation', planetRotations, currentScene)
      animate3D(cam, 'position', camPositions, currentScene)
    }
  },[currentScene, cam])

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