import React, { useCallback, useContext } from 'react'
import { createPortal } from 'react-dom'
import { getActionByCursor, SCENE_ACTIONS } from '../../utils/sceneActions'
import { CamDeviationContext, useContact } from '../../providers/contextProvider';
import { useLanguage } from '../../providers/languageProvider';
import './Cursor.scss';

// Where the cursor was last drawn, so it doesn't jump when it moves into or out of the contact dialog
let lastTransform = null

export const followCursorEvent = (cursorRef) => {
  return (e) => {
    lastTransform = `translate3d(${e.pageX}px, ${e.pageY}px, 0)`
    if (cursorRef?.current) {
      cursorRef.current.style.transform = lastTransform;
    }
  }
}

export const Cursor = React.forwardRef(({ currentScene }, ref) => {
  const [camDeviation] = useContext(CamDeviationContext);
  const { open: contactOpen } = useContact();
  const { t } = useLanguage();
  const action = getActionByCursor(currentScene, camDeviation);
  const labels = { [SCENE_ACTIONS.NEXT]: t('cursor.next'), [SCENE_ACTIONS.BACK]: t('cursor.back') };

  const setCircle = useCallback((node) => {
    if (node && lastTransform) node.style.transform = lastTransform
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }, [ref])

  const circle = (
      <div className='cursor-circle' ref={setCircle} aria-hidden="true">
        <span>{labels[action] ?? action}</span>
      </div>
  )

  // The contact dialog is drawn in the browser's top layer, above any z-index: while it's open the
  // cursor goes inside it, or it would be hidden under it
  const dialog = contactOpen ? document.getElementById('contact-dialog') : null

  return dialog ? createPortal(circle, dialog) : circle
});
