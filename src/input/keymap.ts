import type { Command } from '../commands'
import type { EffectName } from '../engine/effects'
import { PAD_LETTERS } from '../engine/tempo'

// Teclas por event.code (posição física), para funcionar igual em qualquer layout.
const slotKey = /^(?:Digit|Numpad)([1-8])$/
const padKeys = [...PAD_LETTERS].map((letter) => `Key${letter}`)
const effectKeys: Record<string, { deck: number; effect: EffectName }> = {
  KeyZ: { deck: 0, effect: 'filter' },
  KeyX: { deck: 0, effect: 'echo' },
  KeyC: { deck: 1, effect: 'filter' },
  KeyV: { deck: 1, effect: 'echo' },
}
const modeKeys: Record<string, number> = { Digit9: 0, Numpad9: 0, Digit0: 1, Numpad0: 1 }

export function resolveCommand(code: string, repeat: boolean): Command | null {
  if (repeat) return null
  if (code === 'Space') return { type: 'togglePlay' }
  const match = slotKey.exec(code)
  if (match) return { type: 'selectSlot', slot: Number(match[1]) - 1 }
  const pad = padKeys.indexOf(code)
  if (pad !== -1) return { type: 'triggerPad', pad }
  if (code in effectKeys) return { type: 'effectPress', ...effectKeys[code] }
  if (code in modeKeys) return { type: 'toggleEffectMode', deck: modeKeys[code] }
  return null
}

// Soltar tecla: só os efeitos reagem (modo segurar).
export function resolveRelease(code: string): Command | null {
  return code in effectKeys ? { type: 'effectRelease', ...effectKeys[code] } : null
}

export interface LegendEntry {
  keys: string
  action: string
  codes: string[]
}

// Fonte da legenda na tela; o teste garante que cada código listado tem comando.
export const KEY_LEGEND: LegendEntry[] = [
  { keys: 'Espaço', action: 'tocar / parar', codes: ['Space'] },
  { keys: '1–8', action: 'beats', codes: ['1', '2', '3', '4', '5', '6', '7', '8'].map((n) => `Digit${n}`) },
  { keys: 'Q W E R / A S D F', action: 'pads', codes: padKeys },
  { keys: 'Z / X', action: 'filtro / eco do Deck A', codes: ['KeyZ', 'KeyX'] },
  { keys: 'C / V', action: 'filtro / eco do Deck B', codes: ['KeyC', 'KeyV'] },
  { keys: '9 / 0', action: 'modo manter/segurar dos decks A / B', codes: ['Digit9', 'Digit0'] },
]
