import { describe, expect, it } from 'vitest'
import { resolveCommand } from './keymap'

describe('resolveCommand', () => {
  it('mapeia Espaço para togglePlay', () => {
    expect(resolveCommand('Space', false)).toEqual({ type: 'togglePlay' })
  })

  it('mapeia Digit1–8 para os slots 0–7', () => {
    expect(resolveCommand('Digit1', false)).toEqual({ type: 'selectSlot', slot: 0 })
    expect(resolveCommand('Digit8', false)).toEqual({ type: 'selectSlot', slot: 7 })
  })

  it('mapeia o teclado numérico igual à fila de números', () => {
    expect(resolveCommand('Numpad5', false)).toEqual(resolveCommand('Digit5', false))
  })

  it('ignora tecla segurada', () => {
    expect(resolveCommand('Space', true)).toBeNull()
    expect(resolveCommand('Digit2', true)).toBeNull()
  })

  it('ignora teclas sem comando', () => {
    expect(resolveCommand('KeyZ', false)).toBeNull()
    expect(resolveCommand('Digit9', false)).toBeNull()
    expect(resolveCommand('Digit0', false)).toBeNull()
  })
})
