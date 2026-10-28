import { useRef } from 'react'

// Botão "Carregar vários": abre o seletor com múltiplos arquivos de áudio.
export function LoadManyButton({ onFiles }: { onFiles: (files: File[]) => void }) {
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
          if (files.length > 0) onFiles(files)
        }}
      />
    </>
  )
}
