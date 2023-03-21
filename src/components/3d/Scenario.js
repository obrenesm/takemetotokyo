import React, { useEffect, useRef, useContext } from 'react'
//import * as THREE from 'three'
// import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { camPositions, planetRotations, planePositions } from './../../data/scenesData'
import { Planet } from './Planet'
import { Airplane } from './Airplane'
import { Pin } from './Pin'
import gsap from 'gsap'

// import { Context } from '../ContextProvider'
import { CamDeviationContext } from '../ContextProvider'
import { animate3D } from './../../utils/utils'


export function Scenario({currentScene, ...props}) {
  const planet = useRef(null)
  const plane = useRef(null)
  const cam = useThree(state => state.camera)

  function animateCelebration() {
    let tl = gsap.timeline();

      tl
      .to(plane.current.position, { duration: 1.2, 
                                    z: 18
                                  }, 2.5)
      .to(plane.current.position, { duration: 1.7, 
                                    z: 14
                                  })
      .to(plane.current.rotation, { duration: 2, 
                                    x: -6.3
                                  }, 2.6)
  }
  
  useFrame((state, delta) => {
    cam.lookAt(0, 0, 0)
  })

  useEffect(() => {
    if (!!planet){
      animate3D(planet.current, 'rotation', planetRotations, currentScene)
      animate3D(cam, 'position', camPositions, currentScene)

      // if (currentScene === 2) {
      //   let tl = gsap.timeline({} );

      // tl
      // .to(plane.current.position, { duration: 1.2, 
      //                               z: 18, 
      //                             }, )
      // .to(plane.current.position, { duration: 1.7, 
      //                               z: 14, 
      //                             })
      // .to(plane.current.rotation, { duration: 2, 
      //                               x: -6.3, 
      //                             }, .2)
      // }

      if (currentScene === 2) {
        //TODO spin on the first, then it just change Z position on the following, why? 
        animateCelebration()
      }
    }
  },[currentScene, cam])

  return (
    <>
      <group ref={plane} position={[-0.2, 0.6, 14]}>
        <Airplane/>
      </group>
      <group scale={1.6} ref={planet} rotation={[Math.PI / 35, Math.PI / 1.5, 0]}>
        <Planet/>
        <Pin pos={[-8.7, 1.6, 0.7]} rot={[0, 0, Math.PI / 2]} />
        <Pin pos={[4.4, 5.4, -5.6]} rot={[-Math.PI / 2, -Math.PI / 3.2, -Math.PI / 3.0]} />
      </group>
    </>
  )
}