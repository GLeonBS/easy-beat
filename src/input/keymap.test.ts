import { describe, expect, it } from 'vitest'
import { KEY_LEGEND, resolveCommand, resolveRelease } from './keymap'

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

  it('mapeia Z X / C V para filtro e eco dos decks A / B', () => {
    expect(resolveCommand('KeyZ', false)).toEqual({ type: 'effectPress', deck: 0, effect: 'filter' })
    expect(resolveCommand('KeyX', false)).toEqual({ type: 'effectPress', deck: 0, effect: 'echo' })
    expect(resolveCommand('KeyC', false)).toEqual({ type: 'effectPress', deck: 1, effect: 'filter' })
    expect(resolveCommand('KeyV', false)).toEqual({ type: 'effectPress', deck: 1, effect: 'echo' })
  })

  it('mapeia 9 / 0 para o modo dos decks A / B', () => {
    expect(resolveCommand('Digit9', false)).toEqual({ type: 'toggleEffectMode', deck: 0 })
    expect(resolveCommand('Digit0', false)).toEqual({ type: 'toggleEffectMode', deck: 1 })
    expect(resolveCommand('Numpad0', false)).toEqual(resolveCommand('Digit0', false))
  })

  it('ignora tecla segurada', () => {
    expect(resolveCommand('Space', true)).toBeNull()
    expect(resolveCommand('Digit2', true)).toBeNull()
    expect(resolveCommand('KeyD', true)).toBeNull()
    expect(resolveCommand('KeyX', true)).toBeNull()
  })

  it('ignora teclas sem comando', () => {
    expect(resolveCommand('KeyM', false)).toBeNull()
    expect(resolveCommand('Enter', false)).toBeNull()
  })
})

describe('resolveRelease', () => {
  it('soltar Z X C V gera effectRelease', () => {
    expect(resolveRelease('KeyZ')).toEqual({ type: 'effectRelease', deck: 0, effect: 'filter' })
    expect(resolveRelease('KeyV')).toEqual({ type: 'effectRelease', deck: 1, effect: 'echo' })
  })

  it('soltar outras teclas não faz nada', () => {
    expect(resolveRelease('Space')).toBeNull()
    expect(resolveRelease('KeyQ')).toBeNull()
    expect(resolveRelease('Digit9')).toBeNull()
  })
})

describe('KEY_LEGEND', () => {
  it('toda tecla da legenda executa um comando', () => {
    for (const entry of KEY_LEGEND) {
      for (const code of entry.codes) expect(resolveCommand(code, false), `${entry.keys} (${code})`).not.toBeNull()
    }
  })
})
