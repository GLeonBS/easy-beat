import { engine, type Bars } from '../engine'

export type Command = { type: 'togglePlay' } | { type: 'selectSlot'; slot: number }

// Ações nomeadas: teclado e mouse disparam sempre estes mesmos comandos.
export const commands = {
  start: () => engine.start(),
  togglePlay: () => engine.togglePlay(),
  selectSlot: (slot: number) => engine.selectSlot(slot),
  loadSlot: (slot: number, file: File) => engine.loadSlot(slot, file),
  loadDeck: (deck: number, files: File[]) => engine.loadDeck(deck, files),
  setBars: (slot: number, bars: Bars) => engine.setBars(slot, bars),

  execute(command: Command) {
    switch (command.type) {
      case 'togglePlay':
        return commands.togglePlay()
      case 'selectSlot':
        return commands.selectSlot(command.slot)
    }
  },
}
