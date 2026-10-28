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

  it('mapeia Q W E R / A S D F para os pads 0–7', () => {
    expect(resolveCommand('KeyQ', false)).toEqual({ type: 'triggerPad', pad: 0 })
    expect(resolveCommand('KeyR', false)).toEqual({ type: 'triggerPad', pad: 3 })
    expect(resolveCommand('KeyA', false)).toEqual({ type: 'triggerPad', pad: 4 })
    expect(resolveCommand('KeyF', false)).toEqual({ type: 'triggerPad', pad: 7 })
  })

  it('ignora tecla segurada', () => {
    expect(resolveCommand('Space', true)).toBeNull()
    expect(resolveCommand('Digit2', true)).toBeNull()
    expect(resolveCommand('KeyD', true)).toBeNull()
  })

  it('ignora teclas sem comando', () => {
    expect(resolveCommand('KeyZ', false)).toBeNull()
    expect(resolveCommand('Digit9', false)).toBeNull()
    expect(resolveCommand('Digit0', false)).toBeNull()
  })
})
