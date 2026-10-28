import { useRef } from 'react'
import { commands } from '../commands'

export function DeckLoadButton({ deck }: { deck: number }) {
  const fileInput = useRef<HTMLInputElement>(null)

  return (
    <>
      <button type="button" onClick={() => fileInput.current?.click()}>
        Carregar vários
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="audio/*"
        multiple
        hidden
        onChange={(event) => {
          const files = Array.from(event.target.files ?? [])
          event.target.value = ''
          if (files.length > 0) void commands.loadDeck(deck, files)
        }}
      />
    </>
  )
}
