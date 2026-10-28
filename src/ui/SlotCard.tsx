import { useRef } from 'react'
import { commands } from '../commands'
import type { Bars, EngineState } from '../engine'
import { computeBpm, deckOf, isBpmCompatible } from '../engine/tempo'
import { formatBpm } from './format'

const BAR_OPTIONS: Bars[] = [4, 8]

function slotStatus(index: number, state: EngineState): string {
  const deck = state.decks[deckOf(index)]
  if (state.loading[index]) return 'carregando…'
  if (state.playing && deck.current === index) return 'tocando'
  return state.slots[index] ? 'pronto' : 'vazio'
}

export function SlotCard({ index, state }: { index: number; state: EngineState }) {
  const fileInput = useRef<HTMLInputElement>(null)
  const beat = state.slots[index]
  const bars = state.bars[index]
  const bpm = beat ? computeBpm(beat.duration, bars) : null
  const mismatch = bpm !== null && state.bpm !== null && !isBpmCompatible(bpm, state.bpm)
  const status = slotStatus(index, state)
  const isPlaying = state.playing && state.decks[deckOf(index)].current === index

  return (
    <section className={`slot slot-${status.replace('…', '')}`} onClick={() => commands.selectSlot(index)}>
      <header className="slot-header">
        <kbd>{index + 1}</kbd>
        <span className="slot-status">{status}</span>
      </header>
      <p className="slot-name" title={beat?.fileName}>
        {beat ? beat.fileName : 'Sem beat'}
      </p>
      <div className="slot-bars" onClick={(event) => event.stopPropagation()}>
        Compassos:
        {BAR_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={bars === option}
            onClick={() => commands.setBars(index, option)}
          >
            {option}
          </button>
        ))}
      </div>
      <p className="slot-bpm">{bpm === null ? '—' : `${formatBpm(bpm)} BPM`}</p>
      {mismatch && <p className="slot-warning">Velocidade diferente da mesa</p>}
      <button
        type="button"
        className="slot-load"
        disabled={isPlaying || state.loading[index]}
        onClick={(event) => {
          event.stopPropagation()
          fileInput.current?.click()
        }}
      >
        Carregar
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="audio/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (file) void commands.loadSlot(index, file)
        }}
      />
    </section>
  )
}
