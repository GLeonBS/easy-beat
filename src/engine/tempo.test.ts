import { describe, expect, it } from 'vitest'
import { computeBpm, deckOf, emptyIndices, isBpmCompatible, slotsToPlay } from './tempo'

describe('computeBpm', () => {
  it('8 s com 4 compassos = 120 BPM', () => {
    expect(computeBpm(8, 4)).toBe(120)
  })

  it('8 s com 8 compassos = 240 BPM', () => {
    expect(computeBpm(8, 8)).toBe(240)
  })
})

describe('isBpmCompatible', () => {
  it('aceita diferença de até 2%', () => {
    expect(isBpmCompatible(91, 90)).toBe(true)
  })

  it('rejeita diferença maior que 2%', () => {
    expect(isBpmCompatible(100, 90)).toBe(false)
  })
})

describe('deckOf', () => {
  it('slots 0–3 são do Deck A e 4–7 do Deck B', () => {
    expect([0, 3].map(deckOf)).toEqual([0, 0])
    expect([4, 7].map(deckOf)).toEqual([1, 1])
  })
})

describe('emptyIndices', () => {
  const beat = { fileName: 'a.wav' }
  const slots = [null, beat, null, null, beat, beat, beat, null]
  const loading = [false, false, false, true, false, false, false, false]

  it('lista os slots vazios do Deck A em ordem, sem os que estão carregando', () => {
    expect(emptyIndices(slots, loading, 0, 4)).toEqual([0, 2])
  })

  it('lista os slots vazios do Deck B', () => {
    expect(emptyIndices(slots, loading, 4, 4)).toEqual([7])
  })

  it('lista os pads vazios em ordem nos 8 pads', () => {
    expect(emptyIndices(slots, loading, 0, 8)).toEqual([0, 2, 7])
  })

  it('retorna vazio com tudo cheio', () => {
    expect(emptyIndices([beat, beat, beat, beat], [false, false, false, false], 0, 4)).toEqual([])
  })
})

describe('slotsToPlay', () => {
  const beat = { fileName: 'a.wav' }
  const slots = [null, null, beat, null, beat, beat, null, null]

  it('sem seleção, toca só o carregado de menor número', () => {
    expect(slotsToPlay(slots, [null, null])).toEqual([2])
  })

  it('retoma o último beat de cada deck', () => {
    expect(slotsToPlay(slots, [2, 5])).toEqual([2, 5])
  })

  it('retoma só o deck que tinha beat', () => {
    expect(slotsToPlay(slots, [null, 4])).toEqual([4])
  })

  it('ignora último selecionado que ficou vazio', () => {
    expect(slotsToPlay(slots, [1, null])).toEqual([2])
  })

  it('retorna vazio sem beats', () => {
    expect(slotsToPlay([null, null], [null, null])).toEqual([])
  })
})
