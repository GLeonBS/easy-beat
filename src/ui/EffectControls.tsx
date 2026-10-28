import { commands } from '../commands'
import type { DeckState } from '../engine'
import type { EffectName } from '../engine/effects'

const EFFECTS: { effect: EffectName; label: string; keys: [string, string] }[] = [
  { effect: 'filter', label: 'Filtro', keys: ['Z', 'C'] },
  { effect: 'echo', label: 'Eco', keys: ['X', 'V'] },
]
const MODE_KEYS = ['9', '0']

// Botões reagem a apertar/soltar (não a clique), para o modo segurar funcionar também com o mouse.
export function EffectControls({ deck, state }: { deck: number; state: DeckState }) {
  return (
    <div className="effects">
      {EFFECTS.map(({ effect, label, keys }) => (
        <button
          key={effect}
          type="button"
          className="effect"
          aria-pressed={state[effect]}
          onPointerDown={() => commands.effectPress(deck, effect)}
          onPointerUp={() => commands.effectRelease(deck, effect)}
          onPointerLeave={() => commands.effectRelease(deck, effect)}
        >
          {label} <kbd>{keys[deck]}</kbd>
        </button>
      ))}
      <button type="button" className="effect-mode" onClick={() => commands.toggleEffectMode(deck)}>
        Modo: {state.mode} <kbd>{MODE_KEYS[deck]}</kbd>
      </button>
    </div>
  )
}
