import { useState, useEffect } from "react";

const getDimensions = () => [window.innerWidth 
  || document.documentElement.clientWidth 
  || document.body.clientWidth, window.innerHeight 
  || document.documentElement.clientHeight 
  || document.body.clientHeight];

export function useWindowDimensions() {
  // save current window width in the state object
  let [dimensions, setDimensions] = useState(getDimensions());

  console.log('use Window Dimensions');

  // in this case useEffect will execute only once because
  // it does not have any dependencies.
  useEffect(() => {
    // timeoutId for debounce mechanism
    let timeoutId = null;
    const resizeListener = () => {
      // prevent execution of previous setTimeout
      clearTimeout(timeoutId);
      // change width from the state object after 150 milliseconds
      timeoutId = setTimeout(() => setDimensions(getDimensions()), 150);
    };
    // set resize listener
    window.addEventListener('resize', resizeListener);

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener('resize', resizeListener);
    }
  }, [])

  return dimensions;
}
