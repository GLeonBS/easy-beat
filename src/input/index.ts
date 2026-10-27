import { commands } from '../commands'
import { resolveCommand } from './keymap'

// Único listener de teclado do app. Retorna a função que o remove.
export function installKeyboard(): () => void {
  const onKeyDown = (event: KeyboardEvent) => {
    const name = resolveCommand(event.code, event.repeat)
    if (!name) return
    event.preventDefault()
    void commands[name]()
  }
  window.addEventListener('keydown', onKeyDown)
  return () => window.removeEventListener('keydown', onKeyDown)
}
