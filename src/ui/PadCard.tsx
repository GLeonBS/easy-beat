import { useRef } from 'react'
import { commands } from '../commands'
import type { EngineState } from '../engine'
import { padName } from '../engine/tempo'

export function PadCard({ pad, state }: { pad: number; state: EngineState }) {
  const fileInput = useRef<HTMLInputElement>(null)
  const sample = state.pads[pad]
  const status = state.padLoading[pad] ? 'carregando…' : state.padPlaying[pad] ? 'tocando' : sample ? 'pronto' : 'vazio'

  return (
    <section className={`slot pad pad-${status.replace('…', '')}`} onClick={() => commands.triggerPad(pad)}>
      <header className="slot-header">
        <kbd>{padName(pad)}</kbd>
        <span className="slot-status">{status}</span>
      </header>
      <p className="slot-name" title={sample?.fileName}>
        {sample ? sample.fileName : 'Sem sample'}
      </p>
      <button
        type="button"
        className="slot-load"
        disabled={state.padLoading[pad]}
        onClick={(event) => {
          event.stopPropagation()
          fileInput.current?.click()
        }}
      >
        Carregar
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="audio/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (file) void commands.loadPad(pad, file)
        }}
      />
    </section>
  )
}
