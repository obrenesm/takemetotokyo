import React from 'react'

export function Pin({rot, pos}){

  return (
    <>
      <mesh rotation={rot} position={pos} >
        <cylinderGeometry args={[0.1, 0.05, 0.2, 20]} />
        <meshStandardMaterial color={'#ef225a'} />
      </mesh>
    </>
  )
}