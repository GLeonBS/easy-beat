import { engine, type Bars } from '../engine'
import type { EffectName } from '../engine/effects'

export type Command =
  | { type: 'togglePlay' }
  | { type: 'selectSlot'; slot: number }
  | { type: 'triggerPad'; pad: number }
  | { type: 'effectPress'; deck: number; effect: EffectName }
  | { type: 'effectRelease'; deck: number; effect: EffectName }
  | { type: 'toggleEffectMode'; deck: number }

// Ações nomeadas: teclado e mouse disparam sempre estes mesmos comandos.
export const commands = {
  start: () => engine.start(),
  togglePlay: () => engine.togglePlay(),
  selectSlot: (slot: number) => engine.selectSlot(slot),
  loadSlot: (slot: number, file: File) => engine.loadSlot(slot, file),
  loadDeck: (deck: number, files: File[]) => engine.loadDeck(deck, files),
  triggerPad: (pad: number) => engine.triggerPad(pad),
  loadPad: (pad: number, file: File) => engine.loadPad(pad, file),
  loadPads: (files: File[]) => engine.loadPads(files),
  setBars: (slot: number, bars: Bars) => engine.setBars(slot, bars),
  effectPress: (deck: number, effect: EffectName) => engine.effectPress(deck, effect),
  effectRelease: (deck: number, effect: EffectName) => engine.effectRelease(deck, effect),
  toggleEffectMode: (deck: number) => engine.toggleEffectMode(deck),
  releaseHeldEffects: () => engine.releaseHeldEffects(),
  clearDeck: () => engine.clearDeck(),

  execute(command: Command) {
    switch (command.type) {
      case 'togglePlay':
        return commands.togglePlay()
      case 'selectSlot':
        return commands.selectSlot(command.slot)
      case 'triggerPad':
        return commands.triggerPad(command.pad)
      case 'effectPress':
        return commands.effectPress(command.deck, command.effect)
      case 'effectRelease':
        return commands.effectRelease(command.deck, command.effect)
      case 'toggleEffectMode':
        return commands.toggleEffectMode(command.deck)
    }
  },
}
