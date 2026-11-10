import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Planet } from './Planet'
import { Airplane } from './Airplane'
import { Pin } from './Pin'
import gsap from 'gsap'
import { camPositions, planetRotations, planeRestPosition } from './../../data/scenesData'
import { animate3D } from './../../utils/utils'
import { createTurnAroundTimeline, settlePlane } from './../../utils/planeManeuvers'

export function Scenario({currentScene, ...props}) {
  const planet = useRef(null)
  const plane = useRef(null)
  const planeLoop = useRef(null)
  const planeRoll = useRef(null)
  const previousScene = useRef(currentScene)
  const cam = useThree(state => state.camera)
  
  useFrame((state, delta) => {
    cam.lookAt(0, 0, 0)
  })

  useEffect(() => {
    let planeCelebration = gsap.timeline({ repeat: -1, repeatDelay: 7});
    let planeManeuver = null
    const planePose = { plane: plane.current, loop: planeLoop.current, roll: planeRoll.current }

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

      // Leaving the last scene. Going back to CR the planet spins the other way round, so the
      // plane turns around (and turns back when it arrives) instead of flying backwards
      if (previousScene.current === 2 && currentScene !== 2) {
        planeManeuver = currentScene === 1
          ? createTurnAroundTimeline(planePose)
          : settlePlane(planePose)
      }
    }

    previousScene.current = currentScene

    return () => {
      // Kill instead of reverting: the plane keeps its pose until the next maneuver takes over
      // (reverting snapped it, e.g. in the middle of the celebration barrel roll)
      planeCelebration.kill()

      if (planeManeuver && planeManeuver.progress() < 1) {
        // Interrupted by another scene change: bring the plane back to its rest pose smoothly
        planeManeuver.kill()
        settlePlane(planePose)
      }
    }
  },[currentScene, cam])

  return (
    <>
      <group ref={plane} position={planeRestPosition}>
        <Airplane loopRef={planeLoop} rollRef={planeRoll} />
      </group>
      <group scale={1.6} ref={planet} rotation={[Math.PI / 35, Math.PI / 1.5, 0]}>
        <Planet/>
        <Pin pos={[-8.7, 1.6, 0.7]} rot={[0, 0, Math.PI / 2]} />
        <Pin pos={[4.4, 5.4, -5.6]} rot={[-Math.PI / 2, -Math.PI / 3.2, -Math.PI / 3.0]} />
      </group>
    </>
  )
}