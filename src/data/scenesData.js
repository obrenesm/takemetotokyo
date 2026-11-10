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
  rotJpn: {
    x: Math.PI / 5.8,
    y: -Math.PI / 1.28,
    z: 0,
    duration: 2,
    pos: 0.8,
    end: 1
  }
}

// Where the plane cruises in the CR and Jpn scenes (world units)
export const planeRestPosition = [-0.2, 0.6, 14]

// Turn-around played when going back from the last scene (Jpn) to the previous one (CR).
// The planet spins the other way round on the way back, so the plane would look like it
// flies backwards: it lifts off, flips around (half loop + half roll) and flies back
// facing the other way, then flips again once it arrives to face forward in CR.
// Distances are in world units, times in seconds from the click.
export const planeTurn = {
  lift: 0.4,           // how much the plane rises towards the camera before flipping
  loopRadius: 0.6,     // radius of the half loop (pitch, ends upside down)
  liftDuration: 0.55,
  loopDelay: 0,        // the loop starts right on the click, together with the lift
  loopDuration: 1.05,
  rollDuration: 0.7,   // half roll that puts the plane back right side up
  rollOverlap: 0.7,    // how long the loop and the roll run together, so they blend into one move.
                       // Same as rollDuration: the whole roll happens during the loop (it ends with
                       // the loop on the way out and starts with it on the way back)
  spinDelay: 0.65,     // the planet and camera wait this long, so they start spinning when the
                       // plane's nose already points back towards CR on screen (~15° off at 0.65s,
                       // 10° at 0.7s with the durations above: retune it if they change)
  arrivalDelay: 1.8    // second turn, this long after the planet starts spinning (it takes 2s)
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