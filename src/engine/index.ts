import * as Tone from 'tone'

// Motor de áudio: não conhece React. A UI lê o estado via subscribe/getState.
export type EngineStatus = 'idle' | 'starting' | 'ready' | 'error'

export interface EngineState {
  status: EngineStatus
}

let state: EngineState = { status: 'idle' }
const listeners = new Set<() => void>()

function setState(next: EngineState) {
  state = next
  listeners.forEach((listener) => listener())
}

export const engine = {
  getState(): EngineState {
    return state
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },

  // Libera o áudio do navegador; precisa ser chamado a partir de um gesto do usuário.
  async start(): Promise<void> {
    if (state.status === 'starting' || state.status === 'ready') return
    setState({ status: 'starting' })
    try {
      await Tone.start()
      setState({ status: Tone.getContext().state === 'running' ? 'ready' : 'error' })
    } catch {
      setState({ status: 'error' })
    }
  },
}
