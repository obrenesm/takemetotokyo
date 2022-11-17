import React, { useEffect, useRef, useState } from 'react'
//import * as THREE from 'three'
import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Airplane } from './Airplane'
import gasp from 'gsap'
import { ScrollTrigger } from 'react-gsap'
gasp.registerPlugin(ScrollTrigger);

//import { calcObjectPos } from '../../../utils/utils'

//import { useSpring, a } from '@react-spring/three'

export function Earth(props) {
  const scroll = useScroll()
  const { scene, nodes, materials } = useGLTF('/earthflat.gltf')
  const planet = useRef(null)
  const planetRot = [Math.PI / 22, Math.PI / 2.3, 0]

  let currentScene = 0;


  const camPositions = {
    camIntro: {
      x: -5, 
      y: -4, 
      z: 13, 
      duration: 2,
      pos: 0,
      end: 0.5
    },
    camCR: {
      x:0, 
      y:0, 
      z:23, 
      duration: 2,
      pos: 0.5,
      end: 0.7
    },
    // camOffset: {
    //   x:3, 
    //   y:0, 
    //   z:18, 
    //   duration: 2,
    //   pos: 0.7,
    //   end: 1
    // },
    camJpn: {
      x:0, 
      y:0, 
      z:25, 
      duration: 2,
      pos: 1,
      end: 1.1
    }
  }

  const planetRotations = {
    rotIntro: {
      x: 0,
      y: 0,
      z: 0,
      duration: 2,
      pos: 0,
      end: 0.5
    },
    rotCR: {
      x: Math.PI / 22,
      y: Math.PI / 2.3,
      z: 0,
      duration: 2,
      pos: 0.5,
      end: 1
    },
    rotJpn: {
      x: Math.PI / 6,
      y: -Math.PI / 1.32,
      z: 0,
      duration: 2,
      pos: 1,
      end: 1.1
    }
  }

  const scenes = {
    Intro: { 
      pos: 0,
      end: 0.25
    },
    CR: { 
      pos: 0.25,
      end: 0.75
    },
    Jpn: { 
      pos: 0.75,
      end: 1
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


  function animate(model, motion, obj, scene){

    const currentValues = obj[Object.keys(obj)[scene]]

    let pos = (({x, y, z, duration}) => ({x, y, z, duration}))(currentValues)  

    const selected = (motion === 'rotation') ? model.rotation : model.position

    return gasp.to(
      selected,
      pos)
  }

  function Pin({rot, pos}){
      return (
      <mesh rotation={rot} 
      position={pos} >
        <cylinderGeometry args={[0.1, 0.05, 0.2, 20]} />
        <meshStandardMaterial color={'#ef225a'} />
      </mesh>
  )};


        // TODO: MAKE THIS FUNCTION RUN, use it to chang the scene content
  function updateScene(expected, current) {
    if (expected !== current){
      return currentScene = expected      
    }
  }

  //const camera = useThree(state => state.camera)
  
  // useEffect(() => {
  //   camera.position.set (
  //     calcObjectPos(camPositions, 'x'), 
  //     calcObjectPos(camPositions, 'y'), 
  //     calcObjectPos(camPositions, 'z')
  //   )
  // })

  // useFrame((state, delta) => {
  //   state.camera.lookAt(0, 0, 0)

  //   const offset = scroll.offset;

  //   planet.current.rotation.set (
  //     calcObjectPos(planetRotations, 'x', offset), 
  //     calcObjectPos(planetRotations, 'y', offset),
  //     0
  //   )

  //   state.camera.position.set (
  //     calcObjectPos(camPositions, 'x', offset), 
  //     calcObjectPos(camPositions, 'y', offset), 
  //     calcObjectPos(camPositions, 'z', offset)
  //   )
  // })

  console.log('planetRotations', planetRotations[Object.keys(planetRotations)[0]]);


  // useEffect(()=> {
  //   gasp.from(
  //     planet.current.rotation,
  //     pos)
  // })

  useFrame((state, delta) => {

    const offset = scroll.offset;
    //console.log('offset', offset);
    const expectedScene = calcObjIndex(scenes)
    const globe = planet.current
    const cam = state.camera

    cam.lookAt(0, 0, 0)

    if (!!planet && expectedScene !== currentScene){
      //console.log('expectedScene', expectedScene)
      
      //currentScene = expectedScene

      updateScene(expectedScene, currentScene)
      // const currentValues = planetRotations[Object.keys(planetRotations)[currentScene]]

      // let pos = (({x, y, z}) => ({x, y, z}))(currentValues)  

      // console.log('pos', pos);

      // gasp.to(
      //   planet.current.rotation,
      //   pos)

      animate(globe, 'rotation', planetRotations, currentScene)
      animate(cam, 'position', camPositions, currentScene)

    }

//    animate(planet, 'rotation', planetRotations, currentScene)


    // planet.current.rotation.set (
    //   calcObjectPos(planetRotations, 'x', offset), 
    //   calcObjectPos(planetRotations, 'y', offset),
    //   0
    // )

    // state.camera.position.set (
    //   calcObjectPos(camPositions, 'x', offset), 
    //   calcObjectPos(camPositions, 'y', offset), 
    //   calcObjectPos(camPositions, 'z', offset)
    // )
  })

  // useEffect(()=> {

  //   const offset = scroll.offset;

  //   if (!!planet){      
  //     gasp.to(
  //       planet.current.rotation,
  //       {
  //         opacity: 0,
  //         y: -220
  //       },
  //       {
  //         opacity: 1,
  //         y: 0,
  //         scrollTrigger: {
  //           trigger: '#main',
  //           start: "top top",
  //           end: "bottom center",
  //           scrub: true
  //         }
  //       }
  //     );

      // const tl = gsap.timeline();
      // tl.from(planet.current.rotation, { x: Math.PI / 6,
      //                                   y: -Math.PI / 1.32,
      //                                   z: 0 })
      //   .from(planet.current.rotation, { x: 0,
      //                                   y: 0,
      //                                   z: 0 })
      //   .from(planet.current.rotation, { x: Math.PI / 6,
      //                                   y: -Math.PI / 1.32,
      //                                   z: 0 });

      // ScrollTrigger.create({
      //   animation: tl,
      //   trigger: '#main',
      //   start: 'top top',
      //   end: '+=4000',
      //   scrub: true,
      //   pin: true,
      //   anticipatePin: 1
      // });




      // gsap.timeline().to(planet.current.rotation, {
      //   x: Math.PI / 6,
      //   y: -Math.PI / 1.32,
      //   z: 0,
      //   delay: 2,
      //   scrollTrigger: {
      //     //trigger: '.dfg',
      //     markers: true,
      //     start: "top top",
      //     end: "top top ",
      //     scrub: 0.2,
      //   }
      // })

      // .to(planet.current.rotation, {
      //   x: 0,
      //   y: 0,
      //   z: 0,
      //   delay: 4,
      //   scrollTrigger: {
      //     // trigger: planet.current,
      //     markers: true,
      //     start: "top bottom",
      //     end: "top top ",
      //     scrub: 0.2,
      //   }
      // })

      // .to(planet.current.rotation, {
      //   x: Math.PI / 6,
      //   y: -Math.PI / 1.32,
      //   z: 0,
      //   //delay: 2,
      //   scrollTrigger: {
      //     // trigger: planet.current,
      //     markers: true,
      //     start: "top bottom",
      //     end: "top top ",
      //     scrub: 0.2,
      //   }
      // })
//  }
// }, [])

  return (
    <>
      <group ref={planet} scale={1.6} rotation={[Math.PI / 22, Math.PI / 2.3, 0]} dispose={null}>
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
