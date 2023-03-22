import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Planet } from './Planet'
import { Airplane } from './Airplane'
import { Pin } from './Pin'
import gsap from 'gsap'
import { camPositions, planetRotations } from './../../data/scenesData'
import { animate3D } from './../../utils/utils'

export function Scenario({currentScene, ...props}) {
  const planet = useRef(null)
  const plane = useRef(null)
  const cam = useThree(state => state.camera)
  
  useFrame((state, delta) => {
    cam.lookAt(0, 0, 0)
  })

  useEffect(() => {
    let planeCelebration = gsap.timeline({ repeat: -1, repeatDelay: 7});

    if (!!planet){
      animate3D(planet.current, 'rotation', planetRotations, currentScene)
      animate3D(cam, 'position', camPositions, currentScene)

      if (currentScene === 2) {
        planeCelebration
        .to(plane.current.position, { duration: 1.2, 
                                      z: 18
                                    }, 2.5)
        .to(plane.current.position, { duration: 1.5, 
                                      z: 14
                                    })
        .to(plane.current.rotation, { duration: 1.7, 
                                      x: -6.3
                                    }, 2.6)
      }
    }

    return () => planeCelebration.revert();
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