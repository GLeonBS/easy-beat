import type { CommandName } from '../commands'

// Teclas por event.code (posição física), para funcionar igual em qualquer layout.
const keymap: Record<string, CommandName> = {
  Space: 'start',
}

export function resolveCommand(code: string, repeat: boolean): CommandName | null {
  if (repeat) return null
  return keymap[code] ?? null
}
