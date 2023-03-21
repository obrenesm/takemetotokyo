import { SCENE_ACTIONS } from '../utils/sceneActions';
export const initialSceneState = { currentScene: 0 };

export function sceneReducer(state, action){
  switch(action.type){
    case SCENE_ACTIONS.NEXT:
      return { currentScene: state.currentScene + 1 };
    case SCENE_ACTIONS.BACK:
      return { currentScene: state.currentScene - 1 };
    case SCENE_ACTIONS.RETURN:
      return { currentScene: 0 };
    case SCENE_ACTIONS.NONE:
      return { currentScene: state.currentScene };
    default:
      return new Error('Invalid action');
  }
}