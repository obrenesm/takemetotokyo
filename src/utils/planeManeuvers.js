import gsap from 'gsap'
import { planeRestPosition, planeTurn } from '../data/scenesData'

const TAU = Math.PI * 2
const REST_Z = planeRestPosition[2]

// Every maneuver works on { plane, loop, roll }:
// - plane: the group that sets the plane's position (also used by the celebration in Scenario)
// - loop / roll: the pitch and roll pivots inside <Airplane/>, whose axes are the plane's own
//   (loop turns around the wings axis, roll around the nose axis)

// A whole number of turns looks exactly like 0, so tweening to the closest one never spins the long way
const nearestTurn = (angle) => Math.round(angle / TAU) * TAU

const poseTargets = ({ plane, loop, roll }) => [plane.position, plane.rotation, loop.rotation, roll.rotation]

// Angles are accumulated (0 -> -PI -> -2PI) so the plane keeps turning the same way, then folded back to 0
const resetAngles = ({ plane, loop, roll }) => {
  plane.rotation.x = 0
  loop.rotation.x = 0
  roll.rotation.z = 0
}

// Leaving: half loop (pitch up and over, ends upside down) blended into a half roll (right side up
// again): the roll starts while the plane is still pulling up and both end together, so it reads as
// a single move. The plane ends up facing the opposite way. (An Immelmann turn)
// The roll pivot is inside the loop one, so the plane always rolls around its own nose and the end
// pose is the same whatever the overlap
function addTurnAround(timeline, refs, at) {
  const { loop, roll } = refs
  const { loopDuration, rollDuration, rollOverlap } = planeTurn

  timeline
    .to(loop.rotation, { x: -Math.PI, duration: loopDuration, ease: 'power2.inOut' }, at)
    .to(roll.rotation, { z: Math.PI, duration: rollDuration, ease: 'power2.inOut' }, at + loopDuration - rollOverlap)
}

// Arriving: the same turn the other way round, so it ends facing forward as it started: half roll
// (upside down) blended into the second half of the loop while coming down. Both start together
// and the shorter roll is done before the plane is back down, so the wings never dip below their
// cruise height. (A split-S)
function addTurnBack(timeline, refs, at, onComplete) {
  const { plane, loop, roll } = refs
  const { loopDuration, rollDuration, rollOverlap } = planeTurn
  const loopAt = at + rollDuration - rollOverlap

  timeline
    .to(roll.rotation, { z: Math.PI * 2, duration: rollDuration, ease: 'power2.inOut' }, at)
    .to(loop.rotation, { x: -Math.PI * 2, duration: loopDuration, ease: 'power2.inOut' }, loopAt)
    .to(plane.position, { z: REST_Z, duration: loopDuration, ease: 'power2.inOut', onComplete }, loopAt)
}

// Plane lifts off, flips to face the other way, and once the planet has stopped it flips again
// and comes down at its usual spot, facing forward like in the CR scene.
export function createTurnAroundTimeline(refs) {
  const { plane } = refs
  const { lift, liftDuration, loopDelay, spinDelay, arrivalDelay } = planeTurn

  // A previous maneuver may have been cut short: start from the rest angles
  gsap.killTweensOf(poseTargets(refs))
  refs.loop.rotation.x = 0
  refs.roll.rotation.z = 0

  const timeline = gsap.timeline()

  // Take off. It also finishes any celebration barrel roll that was in progress when leaving Jpn
  timeline
    .to(plane.position, { z: REST_Z + lift, duration: liftDuration, ease: 'power2.out' }, 0)
    .to(plane.rotation, { x: nearestTurn(plane.rotation.x), duration: liftDuration, ease: 'power2.out' }, 0)

  addTurnAround(timeline, refs, loopDelay)

  // The last tween to finish folds the accumulated angles (0 -> -2PI) back to 0
  addTurnBack(timeline, refs, spinDelay + arrivalDelay, () => resetAngles(refs))

  return timeline
}

// Quickly puts the plane back in its rest pose from wherever it is (used when a maneuver is interrupted)
export function settlePlane(refs, duration = 0.4) {
  const { plane, loop, roll } = refs

  gsap.killTweensOf(poseTargets(refs))

  // resetAngles runs on the last tween (and not on the timeline) so it never fires if the settle is cut short
  return gsap.timeline()
    .to(plane.position, { z: REST_Z, duration, ease: 'power2.out' }, 0)
    .to(plane.rotation, { x: nearestTurn(plane.rotation.x), duration, ease: 'power2.out' }, 0)
    .to(loop.rotation, { x: nearestTurn(loop.rotation.x), duration, ease: 'power2.out' }, 0)
    .to(roll.rotation, { z: nearestTurn(roll.rotation.z), duration, ease: 'power2.out', onComplete: () => resetAngles(refs) }, 0)
}
