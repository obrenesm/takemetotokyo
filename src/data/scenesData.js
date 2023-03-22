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