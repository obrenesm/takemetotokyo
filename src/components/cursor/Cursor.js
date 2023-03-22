import React, { useContext } from 'react'
import { getActionByCursor  } from '../../utils/sceneActions'
import { CamDeviationContext } from '../../providers/contextProvider';
import './Cursor.scss';

export const followCursorEvent = (cursorRef) => {
  return (e) => {
    if (typeof cursorRef !== undefined && cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${e.pageX}px, ${e.pageY}px, 0)`;
    }
  }
}

export const Cursor = React.forwardRef(({ currentScene }, ref) => {
  const [camDeviation] = useContext(CamDeviationContext);
  return (
      <div className='cursor-circle' ref={ref}>
        <span>{getActionByCursor(currentScene, camDeviation)}</span>
      </div>
  )
});