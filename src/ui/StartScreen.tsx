import { commands } from '../commands'
import type { EngineStatus } from '../engine'

export function StartScreen({ status }: { status: EngineStatus }) {
  return (
    <main className="start-screen">
      <h1>EasyBeat</h1>
      <p className="start-instruction">
        Pressione <kbd>Espaço</kbd> para começar
      </p>
      <button type="button" onClick={() => void commands.start()} disabled={status === 'starting'}>
        Começar
      </button>
      {status === 'error' && (
        <p role="alert" className="start-error">
          Não foi possível ligar o som. Tente de novo.
        </p>
      )}
    </main>
  )
}
