import { commands } from '../commands'
import type { EngineState } from '../engine'
import { DECK_COUNT, deckName, SLOTS_PER_DECK } from '../engine/tempo'
import { DeckLoadButton } from './DeckLoadButton'
import { formatBpm } from './format'
import { SlotCard } from './SlotCard'

export function DeckScreen({ state }: { state: EngineState }) {
  return (
    <main className="deck-screen">
      <header className="deck-header">
        <p className="deck-bpm">
          BPM da mesa: <strong>{state.bpm === null ? '—' : formatBpm(state.bpm)}</strong>
        </p>
        <button type="button" onClick={() => void commands.togglePlay()}>
          {state.playing ? 'Parar' : 'Tocar'} <kbd>Espaço</kbd>
        </button>
      </header>
      <p className="deck-message" role="status">
        {state.message}
      </p>
      {Array.from({ length: DECK_COUNT }, (_, deck) => (
        <section key={deck} className="deck">
          <header className="deck-bar">
            <h2 className="deck-title">Deck {deckName(deck)}</h2>
            <DeckLoadButton deck={deck} />
          </header>
          <div className="slot-grid">
            {Array.from({ length: SLOTS_PER_DECK }, (_, offset) => {
              const index = deck * SLOTS_PER_DECK + offset
              return <SlotCard key={index} index={index} state={state} />
            })}
          </div>
        </section>
      ))}
    </main>
  )
}
