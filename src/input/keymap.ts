import type { Command } from '../commands'
import { PAD_LETTERS } from '../engine/tempo'

// Teclas por event.code (posição física), para funcionar igual em qualquer layout.
const slotKey = /^(?:Digit|Numpad)([1-8])$/
const padKeys = [...PAD_LETTERS].map((letter) => `Key${letter}`)

export function resolveCommand(code: string, repeat: boolean): Command | null {
  if (repeat) return null
  if (code === 'Space') return { type: 'togglePlay' }
  const match = slotKey.exec(code)
  if (match) return { type: 'selectSlot', slot: Number(match[1]) - 1 }
  const pad = padKeys.indexOf(code)
  if (pad !== -1) return { type: 'triggerPad', pad }
  return null
}
