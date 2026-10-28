import { DeckScreen } from './DeckScreen'
import { StartScreen } from './StartScreen'
import { useEngineState } from './useEngineState'

export function App() {
  const state = useEngineState()
  return state.status === 'ready' ? <DeckScreen state={state} /> : <StartScreen status={state.status} />
}
