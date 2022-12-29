import React, { useEffect, useRef, useState, useContext } from 'react'
import {scenes} from '../data/scenesData'

import { Context } from './ContextProvider'

export const ScrollControl = () => {
  const [currentScene, setCurrentScene] = useContext(Context)
  const sceneCap = scenes.length - 1
  let scrollTimeout;
  let scrollVariable = 0;
  let scene = 0
  let touchStart;
  let touchEnd;

  function scrollDirection (e, start, end) {
    if (e && e.type === "wheel"){
      return start > end ? 'up' : start < end ? 'down' : ''
    } else if (e && e.type === "touchend" ){
      return start < end ? 'up' : start > end ? 'down' : ''
    } else {
      console.error('Error while scrolling');
    }
  }

  // TODO: generate a Prevent Default (?) to avoid scroll when just clicking a btn

  function updateScene(e) {
    let prevScrollVariable = scrollVariable
    let inputIn;
    let inputOut;
    
    if (e.type === "wheel") {
      scrollVariable += e.deltaY;
      inputIn = prevScrollVariable
      inputOut = scrollVariable
    } else if (e.type === "touchend") {
      inputIn = touchStart
      inputOut = touchEnd
    }

    const direction = scrollDirection(e, inputIn, inputOut)

    if (scene > 0 && direction === 'up') {
      scene = scene-1      
    } else if (scene < sceneCap && direction === 'down') {
      scene = scene+1
    }

    return setCurrentScene(scene)
  }

  const handleScroll = (event) => {
    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
        updateScene(event)
    }, 60);
  };

  const handleTouchStart = (event) => {
    window.addEventListener('touchend', handleTouchEnd);
    touchStart = event.changedTouches[0].screenY

    return () => {
      window.removeEventListener('touchend', handleTouchEnd);
    }; 
  }

  const handleTouchEnd = (event) => {
    touchEnd = event.changedTouches[0].screenY;
    updateScene (event, touchStart, touchEnd)
  }

  useEffect(() => {
    const canvas = document.querySelector('canvas')
    canvas.addEventListener('wheel', handleScroll);
    canvas.addEventListener('touchstart', handleTouchStart);

    return () => {
      canvas.removeEventListener('wheel', handleScroll);
      canvas.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return (
    <></>
  );
};