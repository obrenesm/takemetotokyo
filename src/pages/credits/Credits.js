import React, { useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber';
import { Planet } from './../../components/3d/Planet'
import { Airplane } from './../../components/3d/Airplane'
import { useFrame } from '@react-three/fiber'
import { a } from '@react-spring/three'

import './Credits.scss';

export function Credits(props) {

    document.getElementsByTagName('body')[0].classList.add('credits')

    const planet = useRef(null)
    const airplane = useRef(null)

    function ThumbnailPlanet() {

        useFrame(() => (planet.current.rotation.y -= 0.01))

        return (
            <>
                <a.group ref={planet} scale={0.22} position={[3,-3,0]} rotation={[0, Math.PI / 3.4, 0]}>
                    <Planet/>
                </a.group>
            </>
        )
    }


  return (
    <>
        <div id="main" style={{ width: '100vw', height: '100vh' }}>
            <div className='center'>
                <h1> Credits </h1>
                <p>I used and modified this two 3D files under the Attribution-NonCommercial 4.0 International license</p>
            </div>
            <div className='grid plain'>
                <div className='left'>
                </div>
                <div className='right'>
                    <h3> Airplane </h3>
                    <a href='https://skfb.ly/o7IGr' target="_blank" rel="noreferrer">by mizda3d</a>
                    <p>Modified the colors and changed the animation</p>
                </div>
            </div>
            <div className='grid planet'>
                <div className='left'>
                    <h3> Planet Earth </h3>
                    <a href='https://skfb.ly/6YERJ' target="_blank" rel="noreferrer">by BamPistache</a>
                    <p>Updated the shape for Costa Rica and Japan, replaced the water sphere, and changed the colors</p>
                </div>
            </div>
        <Canvas camera={{ fov: 75, near: 0.1, far: 100, position: [0, 0, 15] }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[200, 300, -100]} angle={0.3} intensity={0.4} />
            <spotLight position={[-200, -400, 100]} angle={1} intensity={0.2} />
            <pointLight position={[-235, 235, 0]} intensity={0.2} />
            <Suspense fallback={null}>
                <a.group ref={airplane} scale={2} position={[-3,0.5,0]} rotation={[(Math.PI / 1.5), (Math.PI / 1), -(Math.PI / 0.7)]} >
                    <Airplane />
                </a.group>
                <ThumbnailPlanet/>
            </Suspense>
        </Canvas>
      </div>
    </>
  )
}