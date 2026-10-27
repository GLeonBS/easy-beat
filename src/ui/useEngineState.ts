import { useSyncExternalStore } from 'react'
import { engine, type EngineState } from '../engine'

export function useEngineState(): EngineState {
  return useSyncExternalStore(engine.subscribe, engine.getState)
}
