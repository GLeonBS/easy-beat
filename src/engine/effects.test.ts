import { describe, expect, it } from 'vitest'
import { echoDelaySeconds, effectAfter } from './effects'

describe('effectAfter', () => {
  it('modo manter: apertar inverte', () => {
    expect(effectAfter(false, 'manter', 'press')).toBe(true)
    expect(effectAfter(true, 'manter', 'press')).toBe(false)
  })

  it('modo manter: soltar não muda', () => {
    expect(effectAfter(true, 'manter', 'release')).toBe(true)
    expect(effectAfter(false, 'manter', 'release')).toBe(false)
  })

  it('modo segurar: apertar liga e soltar desliga', () => {
    expect(effectAfter(false, 'segurar', 'press')).toBe(true)
    expect(effectAfter(true, 'segurar', 'release')).toBe(false)
  })
})

describe('echoDelaySeconds', () => {
  it('colcheia pontuada a 120 BPM = 0,375 s', () => {
    expect(echoDelaySeconds(120)).toBe(0.375)
  })

  it('usa 120 BPM sem BPM da mesa', () => {
    expect(echoDelaySeconds(null)).toBe(0.375)
  })

  it('acompanha o BPM', () => {
    expect(echoDelaySeconds(90)).toBe(0.5)
  })

  it('limita BPMs absurdos a 1,5 s', () => {
    expect(echoDelaySeconds(16.9)).toBe(1.5)
  })
})
