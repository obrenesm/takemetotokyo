import React, { useContext } from 'react'
import { getActionByCursor, SCENE_ACTIONS } from '../../utils/sceneActions'
import { CamDeviationContext } from '../../providers/contextProvider';
import { useLanguage } from '../../providers/languageProvider';
import './Cursor.scss';

export const followCursorEvent = (cursorRef) => {
  return (e) => {
    if (cursorRef?.current) {
      cursorRef.current.style.transform = `translate3d(${e.pageX}px, ${e.pageY}px, 0)`;
    }
  }
}

export const Cursor = React.forwardRef(({ currentScene }, ref) => {
  const [camDeviation] = useContext(CamDeviationContext);
  const { t } = useLanguage();
  const action = getActionByCursor(currentScene, camDeviation);
  const labels = { [SCENE_ACTIONS.NEXT]: t('cursor.next'), [SCENE_ACTIONS.BACK]: t('cursor.back') };

  return (
      <div className='cursor-circle' ref={ref}>
        <span>{labels[action] ?? action}</span>
      </div>
  )
});