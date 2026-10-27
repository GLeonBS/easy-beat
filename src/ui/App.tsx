import { DeckScreen } from './DeckScreen'
import { StartScreen } from './StartScreen'
import { useEngineState } from './useEngineState'

export function App() {
  const { status } = useEngineState()
  return status === 'ready' ? <DeckScreen /> : <StartScreen status={status} />
}
