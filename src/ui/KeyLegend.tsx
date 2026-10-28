import { KEY_LEGEND } from '../input/keymap'

export function KeyLegend() {
  return (
    <footer className="key-legend" aria-label="Teclas">
      {KEY_LEGEND.map(({ keys, action }) => (
        <span key={keys}>
          <kbd>{keys}</kbd> {action}
        </span>
      ))}
    </footer>
  )
}
