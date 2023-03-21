import { useScroll } from '@react-three/drei'
import gsap from 'gsap'



export function useCalcObjIndex(obj){
    const offset = useScroll().offset;
    const isIn = (element) => (element.pos <= offset && element.end > offset)

    return Object.values(obj).findIndex(isIn)
}

export function animate3D(model, motion, obj, scene){
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

export function isTouchEnabled() {
  return ( 'ontouchstart' in window ) ||
         ( navigator.maxTouchPoints > 0 ) ||
         ( navigator.msMaxTouchPoints > 0 );
}