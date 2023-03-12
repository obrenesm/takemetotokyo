/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.3 planet.gltf
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export function Planet(props) {
  const { nodes, materials } = useGLTF('/planet.gltf')
  const planet = useRef(null)

  // useFrame(() => (planet.current.rotation.z += 0.1))

  return (
    <group {...props} ref={planet} dispose={null}>
      <mesh geometry={nodes.land.geometry} material={materials['Material.004']} rotation={[Math.PI / 2, 0, 0]} />
      <mesh>
        <sphereGeometry args={[8.46]}/>
        <meshStandardMaterial color={'#3000B0'}/>
      </mesh>
    </group>
  )
}

useGLTF.preload('/planet.gltf')
