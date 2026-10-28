import { engine, type Bars } from '../engine'

export type Command =
  | { type: 'togglePlay' }
  | { type: 'selectSlot'; slot: number }
  | { type: 'triggerPad'; pad: number }

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

  execute(command: Command) {
    switch (command.type) {
      case 'togglePlay':
        return commands.togglePlay()
      case 'selectSlot':
        return commands.selectSlot(command.slot)
      case 'triggerPad':
        return commands.triggerPad(command.pad)
    }
  },
}
