import React, { useEffect, useRef, useState, useContext } from 'react'

export const Context = React.createContext()

// export function useScene() {
//   return useContext(SceneContext)
// }

// export function useSceneUpdate() {
//   return useSceneUpdate(SceneUpdateContext)
// }

// export function SceneProvider({children}) {
//   const [currentScene, setCurrentScene] = useState(0)

//   return (
//     <SceneContext.Provider value={currentScene}>
//         {children}
//     </SceneContext.Provider>
//   )  
//   // (
//   //   <>
//   //     {/* <Scenario scene={currentScene}/> */}
//   //   </>
//   // )
  
// }