// gsap's core is enough: everything animated on the site is a three.js object (positions,
// rotations), never CSS, so the CSS plugin that the plain 'gsap' import adds stays out
import gsap from 'gsap/gsap-core'

export function animate3D(model, motion, obj, scene, delay = 0){
  const currentValues = obj[Object.keys(obj)[scene]]
  let pos = (({x, y, z, duration}) => ({x, y, z, duration}))(currentValues)
  const selected = (motion === 'rotation') ? model.rotation : model.position

  return gsap.to(
    selected,
    { ...pos, delay })
}
