import { commands } from '../commands'
import type { EngineState } from '../engine'
import { LoadManyButton } from './LoadManyButton'
import { PadCard } from './PadCard'

export function PadsSection({ state }: { state: EngineState }) {
  return (
    <section className="pads">
      <header className="deck-bar">
        <h2 className="deck-title">Pads</h2>
        <LoadManyButton onFiles={(files) => void commands.loadPads(files)} />
      </header>
      <div className="slot-grid">
        {state.pads.map((_, pad) => (
          <PadCard key={pad} pad={pad} state={state} />
        ))}
      </div>
    </section>
  )
}
