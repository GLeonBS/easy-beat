import type { Command } from '../commands'

// Teclas por event.code (posição física), para funcionar igual em qualquer layout.
const slotKey = /^(?:Digit|Numpad)([1-8])$/

export function resolveCommand(code: string, repeat: boolean): Command | null {
  if (repeat) return null
  if (code === 'Space') return { type: 'togglePlay' }
  const match = slotKey.exec(code)
  if (match) return { type: 'selectSlot', slot: Number(match[1]) - 1 }
  return null
}
