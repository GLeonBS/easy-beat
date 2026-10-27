import { engine } from '../engine'

// Ações nomeadas: teclado e mouse disparam sempre estes mesmos comandos.
export const commands = {
  start: () => engine.start(),
}

export type CommandName = keyof typeof commands
