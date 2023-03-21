/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: mizda3d (https://sketchfab.com/mizda3d)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/lowpoly-airplane-c688b00388204564b96840e70aa2b5d5
title: Lowpoly Airplane
*/

import React, { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { a } from '@react-spring/three'
import gsap from 'gsap'

export function Airplane({props, position}) {
  const { nodes, materials } = useGLTF('/airplane.gltf')
  const group = useRef(null)
  const propeller = useRef(null)

  useEffect(() => {
    if (!!group){
      gsap.to(propeller.current.rotation, { duration: 0.5, 
        y: 3.1, repeat: -1, ease: "none"
      })

      let tl = gsap.timeline( {repeat:-1, repeatDelay: 0} );
      
      tl
      .to(group.current.rotation, { duration: 3, 
                                    z: 0.25,
                                    ease: "sine.out"
                                  })
      .to(group.current.rotation, { duration: 3, 
                                    z: -0.25,
                                    ease: "sine.inOut"
                                  })
      .to(group.current.rotation, { duration: 1.5, 
                                    z: 0,
                                    ease: "sine.in"
                                  })
    }
  },[])

  return (
    <a.group scale={0.2} position={position} rotation={[Math.PI / 2, Math.PI / 1.7, 0]} ref={group} {...props} dispose={null}>
      <group name="Body" position={[0, 4.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh name="Object_4" geometry={nodes.Object_4.geometry} material={materials.material} />
        <mesh name="Object_5" geometry={nodes.Object_5.geometry} material={materials.Giallo} />
        <mesh name="Object_6" geometry={nodes.Object_6.geometry} material={materials.Rosso} />
        <mesh name="Object_7" geometry={nodes.Object_7.geometry} material={materials.Vetro} />
      </group>
      <group ref={propeller} name="Propeller" position={[-0.01, 4.11, 1.77]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh name="Object_9" geometry={nodes.Object_9.geometry} material={materials.Grigio} />
        <mesh name="Object_10" geometry={nodes.Object_10.geometry} material={materials.Giallo} />
      </group>
      <group name="Nose" position={[-0.01, 4.11, 1.77]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh name="Object_11" geometry={nodes.Object_11.geometry} material={materials.Rosso} />
      </group>
    </a.group>
  )
}

useGLTF.preload('/airplane.gltf')
