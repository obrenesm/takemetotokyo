
import React, { useRef, useState } from 'react'
import { useGLTF, useScroll } from '@react-three/drei'
//import { useFrame } from '@react-three/fiber'

//function Utils(){
    // const scroll = useScroll()
    // const offset = scroll.offset

    function calcScrollLinearRange(init, fin, offset){
        const range = (Math.min(Math.max(offset, init), fin) - init) * (1/(fin - init))

        console.log('offset 4', offset);

        return (range)
    }

//   function calcScrollParabolicRange(init, fin, offset){
//     const mid = init + ((fin - init) / 2)
//     const range = Math.max(1 - (Math.abs(offset - mid) * 2), 0)

//     return (range)
//   }

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

    function calcObjIndex(obj, offset){
        const isLarger = (element) => element > offset;
        const posArray = Object.values(obj);
        let result = posArray.map(a  => a.pos)

        console.log('offset 3', offset);

        return result.findIndex(isLarger) - 1
    }

    export function calcObjectPos(obj, returnVal, offset){
        const n = calcObjIndex(obj, offset)
        const currentPos = Object.values(obj)[n];
        const nextPos = Object.values(obj)[n + 1];

        console.log('offset 2', offset);

        if (n + 1 <= Object.keys(obj).length && offset < nextPos['pos'] ) {
            const value = currentPos[returnVal] + (calcScrollLinearRange(
                currentPos['pos'], 
                (nextPos['pos']) * netDifference(currentPos[returnVal], nextPos[returnVal]), 
                offset))
            
            return value
        }
    }
//}
