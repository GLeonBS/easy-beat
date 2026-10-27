import { describe, expect, it } from 'vitest'
import { resolveCommand } from './keymap'

describe('resolveCommand', () => {
  it('mapeia Espaço para start', () => {
    expect(resolveCommand('Space', false)).toBe('start')
  })

  it('ignora tecla segurada', () => {
    expect(resolveCommand('Space', true)).toBeNull()
  })

  it('ignora teclas sem comando', () => {
    expect(resolveCommand('KeyZ', false)).toBeNull()
  })
})
