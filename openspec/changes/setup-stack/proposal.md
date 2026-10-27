# Proposal

## Why

O repositório só tem documentação; nenhuma change de funcionalidade (`beat-slots`, `sample-pads`...) pode ser implementada sem o projeto base. Com prazo até 29/10/2026, a fundação precisa existir hoje, já com a estrutura de módulos aprovada em `docs/architecture.md`, para as próximas changes só adicionarem código.

## What Changes

- Criar o projeto **Vite + React + TypeScript** na raiz do repositório, rodando com `npm run dev`.
- Instalar **Tone.js** (áudio), **Dexie** (IndexedDB) e **Vitest** (testes de lógica pura). Dexie só é instalado; nenhum esquema de banco é criado (fica para `persistencia-minima`).
- Criar a estrutura `src/engine`, `src/commands`, `src/input`, `src/ui`, `src/storage`, com o mínimo para ligar as camadas.
- Implementar a **tela inicial** "Pressione Espaço para começar": o áudio só é liberado após o gesto do usuário (limitação do navegador), por teclado ou mouse.
- Preencher o `context` de `openspec/config.yaml` com stack e princípios do projeto.
- Criar `.gitignore` que mantém `node_modules`, build e arquivos de áudio fora do repositório (git já inicializado, remote `origin`).
- Atualizar `CLAUDE.md` com os comandos reais.

Fora desta change: tocar beats, pads, FX, persistência, mapa de teclas completo.

## Capabilities

### New Capabilities
- `audio-start`: liberação do áudio por gesto do usuário — tela inicial, início por teclado ou mouse, e estado "pronto" depois disso.

### Modified Capabilities
<!-- Nenhuma: não existem specs ainda. -->

## Impact

- Novos arquivos: `package.json`, configs de Vite/TS/Vitest, `index.html`, `src/**`, `.gitignore`. O `README.md` existente é mantido.
- Dependências novas: react, react-dom, tone, dexie; dev: vite, typescript, vitest (+ o que o template do Vite trouxer).
- `openspec/config.yaml` e `CLAUDE.md` atualizados.
