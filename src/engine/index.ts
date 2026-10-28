import * as Tone from 'tone'
import { BEATS_PER_BAR, computeBpm, DECK_COUNT, deckName, deckOf, emptySlotsOfDeck, SLOT_COUNT, slotsToPlay } from './tempo'

// Motor de áudio: não conhece React. A UI lê o estado via subscribe/getState.
export type EngineStatus = 'idle' | 'starting' | 'ready' | 'error'
export type Bars = 4 | 8

export interface BeatFile {
  fileName: string
  duration: number
}

export interface DeckState {
  current: number | null
  // Próximo compasso: entra/troca para um slot, ou 'stop' para tirar o deck.
  queued: number | 'stop' | null
  lastSelected: number | null
}

export interface EngineState {
  status: EngineStatus
  bpm: number | null
  playing: boolean
  decks: readonly DeckState[]
  slots: readonly (BeatFile | null)[]
  bars: readonly Bars[]
  loading: readonly boolean[]
  message: string | null
}

const idleDeck: DeckState = { current: null, queued: null, lastSelected: null }

let state: EngineState = {
  status: 'idle',
  bpm: null,
  playing: false,
  decks: Array(DECK_COUNT).fill(idleDeck),
  slots: Array(SLOT_COUNT).fill(null),
  bars: Array(SLOT_COUNT).fill(4),
  loading: Array(SLOT_COUNT).fill(false),
  message: null,
}
const listeners = new Set<() => void>()

// Fora do estado: objetos do Tone.js e o que o relógio de áudio já decidiu, por deck.
const players: (Tone.Player | null)[] = Array(SLOT_COUNT).fill(null)
const activeSlots: (number | null)[] = Array(DECK_COUNT).fill(null)
const switchEventIds: (number | null)[] = Array(DECK_COUNT).fill(null)
let referenceSlot: number | null = null

function setState(patch: Partial<EngineState>) {
  state = { ...state, ...patch }
  listeners.forEach((listener) => listener())
}

function replaceAt<T>(items: readonly T[], index: number, value: T): T[] {
  return items.map((item, i) => (i === index ? value : item))
}

function updateDeck(decks: readonly DeckState[], deck: number, patch: Partial<DeckState>): DeckState[] {
  return replaceAt(decks, deck, { ...decks[deck], ...patch })
}

// BPM da mesa = BPM do primeiro beat carregado (slot de referência).
function deckBpm(slots: EngineState['slots'], bars: EngineState['bars']): number | null {
  if (referenceSlot === null) return null
  const beat = slots[referenceSlot]
  return beat ? computeBpm(beat.duration, bars[referenceSlot]) : null
}

function applyBpm(bpm: number | null) {
  if (bpm !== null) Tone.getTransport().bpm.value = bpm
}

function cancelSwitch(deck: number) {
  const id = switchEventIds[deck]
  if (id !== null) {
    Tone.getTransport().clear(id)
    switchEventIds[deck] = null
  }
}

function play(slots: number[]) {
  applyBpm(state.bpm)
  const now = Tone.now()
  Tone.getTransport().start(now)
  let decks = state.decks
  for (const slot of slots) {
    const deck = deckOf(slot)
    players[slot]?.start(now)
    activeSlots[deck] = slot
    decks = updateDeck(decks, deck, { current: slot, queued: null, lastSelected: slot })
  }
  setState({ playing: true, decks, message: null })
}

function stop() {
  for (let deck = 0; deck < DECK_COUNT; deck++) cancelSwitch(deck)
  Tone.getDraw().cancel(0)
  Tone.getTransport().stop()
  players.forEach((player) => player?.stop())
  activeSlots.fill(null)
  setState({
    playing: false,
    decks: state.decks.map((deck) => ({ ...deck, current: null, queued: null })),
    message: null,
  })
}

// Agenda entrar, trocar ou sair de um deck no início do próximo compasso, no relógio de áudio.
function queue(deck: number, target: number | 'stop') {
  cancelSwitch(deck)
  const transport = Tone.getTransport()
  const ticksPerBar = transport.PPQ * BEATS_PER_BAR
  const nextBar = (Math.floor(transport.ticks / ticksPerBar) + 1) * ticksPerBar
  switchEventIds[deck] = transport.scheduleOnce((time) => {
    switchEventIds[deck] = null
    const previous = activeSlots[deck]
    if (previous !== null) players[previous]?.stop(time)
    if (target !== 'stop') players[target]?.start(time)
    activeSlots[deck] = target === 'stop' ? null : target
    const silent = activeSlots.every((slot) => slot === null) && switchEventIds.every((id) => id === null)
    if (silent) transport.stop(time)
    Tone.getDraw().schedule(() => {
      if (!state.playing) return
      const decks = updateDeck(state.decks, deck, { current: activeSlots[deck], queued: null })
      setState(silent ? { playing: false, decks } : { decks })
    }, time)
  }, `${nextBar}i`)
  const lastSelected = target === 'stop' ? null : target
  setState({ decks: updateDeck(state.decks, deck, { queued: target, lastSelected }), message: null })
}

export const engine = {
  getState(): EngineState {
    return state
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },

  // Libera o áudio do navegador; precisa ser chamado a partir de um gesto do usuário.
  async start(): Promise<void> {
    if (state.status === 'starting' || state.status === 'ready') return
    setState({ status: 'starting' })
    try {
      await Tone.start()
      setState({ status: Tone.getContext().state === 'running' ? 'ready' : 'error' })
    } catch {
      setState({ status: 'error' })
    }
  },

  async togglePlay(): Promise<void> {
    if (state.status !== 'ready') return engine.start()
    if (state.playing) return stop()
    const slots = slotsToPlay(
      state.slots,
      state.decks.map((deck) => deck.lastSelected),
    )
    if (slots.length === 0) return setState({ message: 'Carregue um beat primeiro' })
    play(slots)
  },

  selectSlot(slot: number) {
    if (state.status !== 'ready') return
    if (!state.slots[slot]) return setState({ message: `O slot ${slot + 1} está vazio` })
    if (!state.playing) return play([slot])
    const deck = deckOf(slot)
    if (slot !== activeSlots[deck]) return queue(deck, slot)
    if (state.decks[deck].queued === null) return queue(deck, 'stop')
    cancelSwitch(deck)
    setState({ decks: updateDeck(state.decks, deck, { queued: null, lastSelected: slot }), message: null })
  },

  // Retorna se o arquivo foi carregado.
  async loadSlot(slot: number, file: File): Promise<boolean> {
    if (state.playing && activeSlots.includes(slot)) return false
    setState({ loading: replaceAt(state.loading, slot, true), message: null })
    try {
      const buffer = await Tone.getContext().decodeAudioData(await file.arrayBuffer())
      const player = new Tone.Player(buffer).toDestination()
      player.loop = true
      players[slot]?.dispose()
      players[slot] = player
      if (referenceSlot === null) referenceSlot = slot
      const slots = replaceAt(state.slots, slot, { fileName: file.name, duration: buffer.duration })
      const bars = replaceAt(state.bars, slot, 4)
      const bpm = deckBpm(slots, bars)
      applyBpm(bpm)
      setState({ slots, bars, bpm, loading: replaceAt(state.loading, slot, false) })
      return true
    } catch {
      setState({
        loading: replaceAt(state.loading, slot, false),
        message: `Não foi possível ler o arquivo "${file.name}"`,
      })
      return false
    }
  },

  // Preenche os slots vazios do deck em ordem, um arquivo por vez (o primeiro define o BPM da mesa).
  async loadDeck(deck: number, files: File[]): Promise<void> {
    const free = emptySlotsOfDeck(state.slots, state.loading, deck)
    if (free.length === 0) return setState({ message: `O Deck ${deckName(deck)} está cheio` })
    const accepted = files.slice(0, free.length)
    let loading = state.loading
    for (const slot of free.slice(0, accepted.length)) loading = replaceAt(loading, slot, true)
    setState({ loading, message: null })
    const failed: string[] = []
    for (const [i, file] of accepted.entries()) {
      if (!(await engine.loadSlot(free[i], file))) failed.push(file.name)
    }
    // Cada loadSlot limpa a mensagem; o resumo vem no fim, com erro de arquivo na frente.
    const notes: string[] = []
    if (failed.length > 0) notes.push(`Não foi possível ler: ${failed.join(', ')}`)
    const skipped = files.length - accepted.length
    if (skipped > 0) {
      notes.push(`${skipped === 1 ? '1 arquivo não coube' : `${skipped} arquivos não couberam`} no Deck ${deckName(deck)}`)
    }
    if (notes.length > 0) setState({ message: notes.join('. ') })
  },

  setBars(slot: number, value: Bars) {
    const bars = replaceAt(state.bars, slot, value)
    const bpm = deckBpm(state.slots, bars)
    applyBpm(bpm)
    setState({ bars, bpm })
  },
}
