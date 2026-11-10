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
  liftDuration: 0.4,
  loopDelay: 0.1,      // the loop starts while the plane is still rising
  loopDuration: 0.75,
  rollDuration: 0.5,   // half roll that puts the plane back right side up
  rollOverlap: 0.2,    // the next move starts this long before the previous one ends
  arrivalDelay: 1.8    // second turn, when the camera and planet are done (they take 2s)
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