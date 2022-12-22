import React, { useEffect, useRef, useState, useContext } from 'react'
import { useGLTF, useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import {scenes} from '../data/scenesData'

import { Context } from './ContextProvider'

export const ScrollControl = () => {
  const [currentScene, setCurrentScene] = useContext(Context)
  const scenesLengthCap = scenes.length - 1
  let scrollTimeout;
  let scrollVariable = 0;
  let scene = 0

  console.log('scenesLength', scenesLengthCap);

  function updateScene(delta) {
    const prevScrollVariable = scrollVariable
    scrollVariable += delta;

    if (scene > 0 && prevScrollVariable > scrollVariable){
      scene = scene-1      
    }
    else if (scene < scenesLengthCap && prevScrollVariable < scrollVariable){
      scene = scene+1
    }

    return setCurrentScene(scene)
  }
  const handleScroll = (event) => {
    const { deltaY } = event;

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
        updateScene(deltaY)
    }, 60);
  };

  useEffect(() => {
    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  return (
    <></>
  );
};