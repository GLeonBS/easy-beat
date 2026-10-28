import { commands, type Command } from '../commands'
import { resolveCommand, resolveRelease } from './keymap'

// Único ponto de entrada do teclado: keydown, keyup (efeitos no modo segurar) e perda de foco.
// Retorna a função que remove os listeners.
export function installKeyboard(): () => void {
  const run = (event: KeyboardEvent, command: Command | null) => {
    if (!command) return
    event.preventDefault()
    void commands.execute(command)
  }
  const onKeyDown = (event: KeyboardEvent) => run(event, resolveCommand(event.code, event.repeat))
  const onKeyUp = (event: KeyboardEvent) => run(event, resolveRelease(event.code))
  const onBlur = () => commands.releaseHeldEffects()
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', onBlur)
  return () => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('blur', onBlur)
  }
}
