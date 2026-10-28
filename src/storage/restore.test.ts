import { describe, expect, it } from 'vitest'
import { restoreOrder } from './restore'

describe('restoreOrder', () => {
  it('ordena pela hora em que foram salvos, não pela posição', () => {
    const records = [
      { index: 5, savedAt: 300 },
      { index: 0, savedAt: 200 },
      { index: 2, savedAt: 100 },
    ]
    expect(restoreOrder(records).map((record) => record.index)).toEqual([2, 0, 5])
  })

  it('não altera a lista original', () => {
    const records = [{ savedAt: 2 }, { savedAt: 1 }]
    restoreOrder(records)
    expect(records.map((record) => record.savedAt)).toEqual([2, 1])
  })

  it('aceita lista vazia', () => {
    expect(restoreOrder([])).toEqual([])
  })
})
