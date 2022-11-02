import React, { useEffect, useRef, useState } from 'react'
//import * as THREE from 'three'
import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Airplane } from '../airplane/Airplane'
//import { calcObjectPos } from '../../../utils/utils'

//import { useSpring, a } from '@react-spring/three'

export function Earth(props) {
  const scroll = useScroll()
  const { scene, nodes, materials } = useGLTF('/earthflat.gltf')
  const planet = useRef()
  const planetRot = [Math.PI / 22, Math.PI / 2.3, 0]

  const camPositions = {
    camIntro: {
      x: -5, 
      y: -4, 
      z: 13, 
      pos: 0,
      end: 0.5
    },
    camCR: {
      x:0, 
      y:0, 
      z:23, 
      pos: 0.5,
      end: 0.7
    },
    camOffset: {
      x:3, 
      y:0, 
      z:18, 
      pos: 0.7,
      end: 1
    },
    camJpn: {
      x:0, 
      y:0, 
      z:25, 
      pos: 1,
      end: 1.1
    }
  }

  const planetRotation = {
    init: {
      x: Math.PI / 22,
      y: Math.PI / 2.3,
      z: 0,
      pos: 0,
      end: 0.5
    },
    rotCR: {
      x: Math.PI / 22,
      y: Math.PI / 2.3,
      z: 0,
      pos: 0.5,
      end: 1
    },
    rotJpn: {
      x: Math.PI / 6,
      y: -Math.PI / 1.32,
      z: 0,
      pos: 1,
      end: 1.1
    }
  }

  /** FROM HERE */

  function calcScrollLinearRange(init, fin){
    const offset = scroll.offset
    //console.log('4', offset);
    const range = (Math.min(Math.max(offset, init), fin) - init) * (1/(fin - init))

    return (range)
  }

  function calcScrollParabolicRange(init, fin){
    const offset = scroll.offset
    const mid = init + ((fin - init) / 2)
    const range = Math.max(1 - (Math.abs(offset - mid) * 2), 0)

    return (range)
  }

  function positiveOrNegative(a, b){
    if (a > b) {
      return -1
    } else {
      return 1
    }
  }

  function netDifference(a, b){
    return (Math.max(a, b) - Math.min(a, b)) * positiveOrNegative(a, b)
  }

  function calcObjIndex(obj){
    const offset = scroll.offset;
    const isIn = (element) => (element.pos <= offset && element.end > offset)

    return Object.values(obj).findIndex(isIn)
  }

  function calcObjectPos(obj, returnVal){
    const offset = scroll.offset;
    //console.log('1', offset);
    const n = calcObjIndex(obj)
    const currentPos = Object.values(obj)[n];
    const nextPos = Object.values(obj)[n + 1];

    if (n + 1 <= Object.keys(obj).length && offset < nextPos['pos'] ) {
      const value = currentPos[returnVal] + (calcScrollLinearRange(currentPos['pos'], nextPos['pos']) * netDifference(currentPos[returnVal] , nextPos[returnVal]))
      
      return value
    }
  }

  /** TO HERE */

  function Pin({rot, pos}){
      return (
      <mesh rotation={rot} 
      position={pos} >
        <cylinderGeometry args={[0.1, 0.05, 0.2, 20]} />
        <meshStandardMaterial color={'#ef225a'} />
      </mesh>
  )};

  //const camera = useThree(state => state.camera)
  
  // useEffect(() => {
  //   camera.position.set (
  //     calcObjectPos(camPositions, 'x'), 
  //     calcObjectPos(camPositions, 'y'), 
  //     calcObjectPos(camPositions, 'z')
  //   )
  // })

  useFrame((state, delta) => {
    state.camera.lookAt(0, 0, 0)

    const offset = scroll.offset;
    console.log('offset ORIGIN', offset);

    planet.current.rotation.set (
      calcObjectPos(planetRotation, 'x', offset), 
      calcObjectPos(planetRotation, 'y', offset),
      0
    )

    state.camera.position.set (
      calcObjectPos(camPositions, 'x', offset), 
      calcObjectPos(camPositions, 'y', offset), 
      calcObjectPos(camPositions, 'z', offset)
    )
  })

  return (
    <>
      <group ref={planet} scale={1.6} rotation={planetRot} dispose={null}>
        <mesh geometry={nodes.earth4_lambert1_0.geometry} material={materials['Material.001']} />
        <mesh>
          <sphereGeometry args={[8.45]}/>
          <meshStandardMaterial color={'#3035B0'}/>
        </mesh>
        <Pin pos={[-8.6, 1.5, 1]} rot={[0, 0, Math.PI / 2]} />
        <Pin pos={[4.7, 5.4, -5.5]} rot={[-Math.PI / 2, -Math.PI / 3.2, -Math.PI / 3.0]} />
      </group>
      <Airplane position={[-0.2, 0.6, 14]}/>
    </>
  )
}

useGLTF.preload('/earthflat.gltf')
