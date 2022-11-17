import React, { useEffect, useRef, useState } from 'react'
//import * as THREE from 'three'
import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'



// //function Utils(){
//     let scrollOffset = 0
//     // const offset = scroll.offset

//     function calcScrollLinearRange(init, fin, offset){
//         const range = (Math.min(Math.max(offset, init), fin) - init) * (1/(fin - init))

//         console.log('offset 4', offset);

//         return (range)
//     }

//     function positiveOrNegative(a, b){
//         if (a > b) {
//             return -1
//         } else {
//             return 1
//         }
//     }

//     function netDifference(a, b){
//         return (Math.max(a, b) - Math.min(a, b)) * positiveOrNegative(a, b)
//     }

//     function calcObjIndex(obj, offset){
//         const isLarger = (element) => element > offset;
//         const posArray = Object.values(obj);
//         let result = posArray.map(a  => a.pos)

//         console.log('offset 3', offset);

//         return result.findIndex(isLarger) - 1
//     }

//     export function calcObjectPos(obj, returnVal, offset){
//         const n = calcObjIndex(obj, offset)
//         const currentPos = Object.values(obj)[n];
//         const nextPos = Object.values(obj)[n + 1];

//         console.log('offset 2', offset);

//         if (n + 1 <= Object.keys(obj).length && offset < nextPos['pos'] ) {
//             const value = currentPos[returnVal] + (calcScrollLinearRange(
//                 currentPos['pos'], 
//                 (nextPos['pos']) * netDifference(currentPos[returnVal], nextPos[returnVal]), 
//                 offset))
            
//             return value
//         }
//     }
// //}



export function useCalcObjIndex(obj){
    const offset = useScroll().offset;
    const isIn = (element) => (element.pos <= offset && element.end > offset)

    return Object.values(obj).findIndex(isIn)
}

export function Animate3D(model, motion, obj, scene){

    const currentValues = obj[Object.keys(obj)[scene]]
    let pos = (({x, y, z, duration}) => ({x, y, z, duration}))(currentValues)  
    const selected = (motion === 'rotation') ? model.rotation : model.position

    return gsap.to(
      selected,
      pos)
}

export function UpdateScene(expected, current) {
    if (expected !== current){
      return current = expected      
    }
}