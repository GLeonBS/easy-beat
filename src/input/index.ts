import { commands } from '../commands'
import { resolveCommand } from './keymap'

// Único listener de teclado do app. Retorna a função que o remove.
export function installKeyboard(): () => void {
  const onKeyDown = (event: KeyboardEvent) => {
    const command = resolveCommand(event.code, event.repeat)
    if (!command) return
    event.preventDefault()
    void commands.execute(command)
  }
  window.addEventListener('keydown', onKeyDown)
  return () => window.removeEventListener('keydown', onKeyDown)
}
