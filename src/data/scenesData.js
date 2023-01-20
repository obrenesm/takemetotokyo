import React, { useContext } from "react"
//import { Context } from '../ContextProvider'

// import { CamDeviationContext } from "../components/ContextProvider"
// function CamDeviation(v) {
//  //const [camDeviation, setCamDeviation] = useContext(Context)

//   const x = camDeviation[0]
//   const y = camDeviation[1]
  
//   return v === x ? x : y
// }

// console.log('CamDeviation(v)', CamDeviation('x'));

//import { MousePosition } from '../components/MousePosition'

// const some = MousePosition()


// console.log('MP', some);


// const xDeviation = MousePosition.camDeviation[0]

// console.log('xDeviation', xDeviation);

export const camPositions = {
  camIntro: {
    x: -5, 
    y: -4, 
    z: 13, 
    duration: 2,
    pos: 0,
    end: 0.4
  },
  camCR: {
    x:0, 
    y:0, 
    z:23, 
    duration: 2,
    pos: 0.4,
    end: 0.8
  },
  camJpn: {
    x:0, 
    y:0, 
    z:25, 
    duration: 2,
    pos: 0.8,
    end: 1
  }
}

export const planetRotations = {
  rotIntro: {
    x: Math.PI / 35,
    y: Math.PI / 1.5,
    z: 0,
    duration: 2,
    pos: 0,
    end: 0.4
  },
  rotCR: {
    x: Math.PI / 20,
    y: Math.PI / 2.24,
    z: 0,
    duration: 2,
    pos: 0.4,
    end: 0.8
  },
  // rotJpn: {
  //   x: Math.PI / 195,
  //   y: -Math.PI / 1.25,
  //   z: 0,
  //   duration: 2,
  //   pos: 0.8,
  //   end: 1
  // }
  // original
  rotJpn: {
    x: Math.PI / 5.8,
    y: -Math.PI / 1.28,
    z: 0,
    duration: 2,
    pos: 0.8,
    end: 1
  }
}


export const scenes = [
    { 
        id: 'Intro',
        pos: 0,
        end: 0.4
    },
    { 
        id: 'CR',
        pos: 0.4,
        end: 0.8
    },
    { 
        id: 'Jpn',
        pos: 0.8,
        end: 1
    }
]