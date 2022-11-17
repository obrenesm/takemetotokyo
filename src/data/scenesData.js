import React from "react"

export const camPositions = {
  camIntro: {
    x: -5, 
    y: -4, 
    z: 13, 
    duration: 2,
    pos: 0,
    end: 0.3
  },
  camCR: {
    x:0, 
    y:0, 
    z:23, 
    duration: 2,
    pos: 0.3,
    end: 0.6
  },
  camJpn: {
    x:0, 
    y:0, 
    z:25, 
    duration: 2,
    pos: 0.6,
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
    end: 0.5
  },
  rotCR: {
    x: Math.PI / 22,
    y: Math.PI / 2.3,
    z: 0,
    duration: 2,
    pos: 0.5,
    end: 1
  },
  rotJpn: {
    x: Math.PI / 6,
    y: -Math.PI / 1.32,
    z: 0,
    duration: 2,
    pos: 1,
    end: 1.1
  }
}


export const scenes = [
    { 
        id: 'Intro',
        pos: 0,
        end: 0.25
    },
    { 
        id: 'CR',
        pos: 0.25,
        end: 0.75
    },
    { 
        id: 'Jpn',
        pos: 0.75,
        end: 1
    }
]