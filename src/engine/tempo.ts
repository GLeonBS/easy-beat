// Lógica pura de tempo: sem Tone.js, testável com Vitest.
export const SLOT_COUNT = 8
export const BEATS_PER_BAR = 4
const BPM_TOLERANCE = 0.02

export function computeBpm(duration: number, bars: number): number {
  return (bars * BEATS_PER_BAR * 60) / duration
}

export function isBpmCompatible(bpm: number, reference: number): boolean {
  return Math.abs(bpm - reference) / reference <= BPM_TOLERANCE
}

export const SLOTS_PER_DECK = 4
export const DECK_COUNT = SLOT_COUNT / SLOTS_PER_DECK

// Deck A = slots 0–3, Deck B = slots 4–7.
export function deckOf(slot: number): number {
  return Math.floor(slot / SLOTS_PER_DECK)
}

export function deckName(deck: number): string {
  return deck === 0 ? 'A' : 'B'
}

// Slots do deck livres para receber arquivo: sem beat e sem carregamento em andamento.
export function emptySlotsOfDeck(slots: readonly unknown[], loading: readonly boolean[], deck: number): number[] {
  const first = deck * SLOTS_PER_DECK
  return Array.from({ length: SLOTS_PER_DECK }, (_, offset) => first + offset).filter(
    (slot) => !slots[slot] && !loading[slot],
  )
}

// O que tocar a partir do silêncio: o último beat de cada deck, senão o slot carregado de menor número.
export function slotsToPlay(slots: readonly unknown[], lastSelected: readonly (number | null)[]): number[] {
  const resumed = lastSelected.filter((slot): slot is number => slot !== null && Boolean(slots[slot]))
  if (resumed.length > 0) return resumed
  const first = slots.findIndex(Boolean)
  return first === -1 ? [] : [first]
}
