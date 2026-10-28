import * as Tone from 'tone'
import {
  computeBpm,
  DECK_COUNT,
  deckName,
  deckOf,
  emptyIndices,
  PAD_COUNT,
  padName,
  SLOT_COUNT,
  SLOTS_PER_DECK,
  slotsToPlay,
} from './tempo'

// Motor de áudio: não conhece React. A UI lê o estado via subscribe/getState.
export type EngineStatus = 'idle' | 'starting' | 'ready' | 'error'
export type Bars = 4 | 8

export interface BeatFile {
  fileName: string
  duration: number
}

export interface DeckState {
  current: number | null
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
  pads: readonly (BeatFile | null)[]
  padLoading: readonly boolean[]
  padPlaying: readonly boolean[]
  message: string | null
}

const idleDeck: DeckState = { current: null, lastSelected: null }

let state: EngineState = {
  status: 'idle',
  bpm: null,
  playing: false,
  decks: Array(DECK_COUNT).fill(idleDeck),
  slots: Array(SLOT_COUNT).fill(null),
  bars: Array(SLOT_COUNT).fill(4),
  loading: Array(SLOT_COUNT).fill(false),
  pads: Array(PAD_COUNT).fill(null),
  padLoading: Array(PAD_COUNT).fill(false),
  padPlaying: Array(PAD_COUNT).fill(false),
  message: null,
}
const listeners = new Set<() => void>()

// Fora do estado: objetos do Tone.js.
const players: (Tone.Player | null)[] = Array(SLOT_COUNT).fill(null)
const padPlayers: (Tone.Player | null)[] = Array(PAD_COUNT).fill(null)
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

function decodeFile(file: File): Promise<AudioBuffer> {
  return file.arrayBuffer().then((data) => Tone.getContext().decodeAudioData(data))
}

// Carrega arquivos nas posições livres, um por vez, e devolve o resumo: arquivos ilegíveis primeiro, depois os que não couberam.
async function loadInto(
  free: number[],
  files: File[],
  load: (index: number, file: File) => Promise<boolean>,
  where: string,
): Promise<string | null> {
  const failed: string[] = []
  for (const [i, file] of files.slice(0, free.length).entries()) {
    if (!(await load(free[i], file))) failed.push(file.name)
  }
  const notes: string[] = []
  if (failed.length > 0) notes.push(`Não foi possível ler: ${failed.join(', ')}`)
  const skipped = files.length - free.length
  if (skipped > 0) notes.push(`${skipped === 1 ? '1 arquivo não coube' : `${skipped} arquivos não couberam`} ${where}`)
  return notes.length > 0 ? notes.join('. ') : null
}

function markLoading(loading: readonly boolean[], indices: number[]): boolean[] {
  return loading.map((value, index) => value || indices.includes(index))
}

function play(slots: number[]) {
  applyBpm(state.bpm)
  const now = Tone.now()
  let decks = state.decks
  for (const slot of slots) {
    const deck = deckOf(slot)
    players[slot]?.start(now)
    decks = updateDeck(decks, deck, { current: slot, lastSelected: slot })
  }
  setState({ playing: true, decks, message: null })
}

// Para os decks; os pads só são cortados pelo stop() da mesa (Espaço/botão).
function stopDecks(decks: readonly DeckState[]) {
  players.forEach((player) => player?.stop())
  setState({ playing: false, decks: decks.map((deck) => ({ ...deck, current: null })), message: null })
}

function stop() {
  padPlayers.forEach((player) => player?.stop())
  setState({ padPlaying: state.padPlaying.map(() => false) })
  stopDecks(state.decks)
}

// Entra, troca ou sai (target = null) de um deck na hora; o beat novo começa do início do loop. O tempo entre decks é do DJ.
function switchDeck(deck: number, target: number | null) {
  const now = Tone.now()
  const previous = state.decks[deck].current
  if (previous !== null) players[previous]?.stop(now)
  if (target === null) {
    const decks = updateDeck(state.decks, deck, { current: null, lastSelected: null })
    if (decks.every((other) => other.current === null)) return stopDecks(decks)
    return setState({ decks, message: null })
  }
  players[target]?.start(now)
  setState({ decks: updateDeck(state.decks, deck, { current: target, lastSelected: target }), message: null })
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
    switchDeck(deck, slot === state.decks[deck].current ? null : slot)
  },

  // Retorna se o arquivo foi carregado.
  async loadSlot(slot: number, file: File): Promise<boolean> {
    if (state.playing && state.decks.some((deck) => deck.current === slot)) return false
    setState({ loading: replaceAt(state.loading, slot, true), message: null })
    try {
      const buffer = await decodeFile(file)
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
    const free = emptyIndices(state.slots, state.loading, deck * SLOTS_PER_DECK, SLOTS_PER_DECK)
    if (free.length === 0) return setState({ message: `O Deck ${deckName(deck)} está cheio` })
    setState({ loading: markLoading(state.loading, free.slice(0, files.length)), message: null })
    // Cada loadSlot limpa a mensagem; o resumo vem no fim.
    const summary = await loadInto(free, files, engine.loadSlot, `no Deck ${deckName(deck)}`)
    if (summary) setState({ message: summary })
  },

  async loadPad(pad: number, file: File): Promise<boolean> {
    setState({ padLoading: replaceAt(state.padLoading, pad, true), message: null })
    try {
      const buffer = await decodeFile(file)
      const player = new Tone.Player(buffer).toDestination()
      // onstop dispara também para a fonte cortada por restart; só apaga o indicador se o pad parou de fato.
      player.onstop = () => {
        setTimeout(() => {
          if (padPlayers[pad] === player && player.state === 'stopped') {
            setState({ padPlaying: replaceAt(state.padPlaying, pad, false) })
          }
        }, 0)
      }
      padPlayers[pad]?.dispose()
      padPlayers[pad] = player
      setState({
        pads: replaceAt(state.pads, pad, { fileName: file.name, duration: buffer.duration }),
        padLoading: replaceAt(state.padLoading, pad, false),
        padPlaying: replaceAt(state.padPlaying, pad, false),
      })
      return true
    } catch {
      setState({
        padLoading: replaceAt(state.padLoading, pad, false),
        message: `Não foi possível ler o arquivo "${file.name}"`,
      })
      return false
    }
  },

  // Preenche os pads vazios em ordem (Q W E R A S D F), um arquivo por vez.
  async loadPads(files: File[]): Promise<void> {
    const free = emptyIndices(state.pads, state.padLoading, 0, PAD_COUNT)
    if (free.length === 0) return setState({ message: 'Os pads estão cheios' })
    setState({ padLoading: markLoading(state.padLoading, free.slice(0, files.length)), message: null })
    const summary = await loadInto(free, files, engine.loadPad, 'nos pads')
    if (summary) setState({ message: summary })
  },

  // Toca na hora, sem quantizar; repetir o pad reinicia o sample.
  triggerPad(pad: number) {
    if (state.status !== 'ready') return
    const player = padPlayers[pad]
    if (!player) return setState({ message: `O pad ${padName(pad)} está vazio` })
    const now = Tone.now()
    if (player.state === 'started') player.restart(now)
    else player.start(now)
    setState({ padPlaying: replaceAt(state.padPlaying, pad, true), message: null })
  },

  setBars(slot: number, value: Bars) {
    const bars = replaceAt(state.bars, slot, value)
    const bpm = deckBpm(state.slots, bars)
    applyBpm(bpm)
    setState({ bars, bpm })
  },
}
