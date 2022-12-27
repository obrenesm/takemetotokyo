import React, {  useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Earthh(props) {
  const { nodes, materials } = useGLTF('/earthflat.gltf')
  const planet = useRef(null)

  return (
    <group ref={planet} dispose={null}>
      <mesh geometry={nodes.earth4_lambert1_0.geometry} material={materials['Material.001']} />
      <mesh>
        <sphereGeometry args={[8.46]}/>
        <meshStandardMaterial color={'#3000B0'}/>
      </mesh>
    </group>
  )
}

useGLTF.preload('/earthflat.gltf')
