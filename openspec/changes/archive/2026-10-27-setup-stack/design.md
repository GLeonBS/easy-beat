# Design

## Context

Repositório sem código; stack e estrutura já aprovadas em `docs/architecture.md` (ver proposal.md — Why). Node 22 disponível. Navegador alvo: Chrome/Edge. Requisitos de comportamento em `specs/audio-start/spec.md`.

## Goals / Non-Goals

**Goals:**
- Projeto que sobe com `npm run dev`, compila com `npm run build` e testa com `npm test`.
- A tela inicial já atravessar todas as camadas (input → commands → engine → ui), servindo de molde para as próximas changes.

**Non-Goals:**
- Esquema Dexie, tabelas ou qualquer dado salvo.
- Mapa de teclas além de Espaço na tela inicial.
- Estilo visual elaborado; CSS simples basta.

## Decisions

**Scaffold com `npm create vite@latest` (template `react-ts`) na raiz.** Menos config manual que montar à mão. O template traz ESLint; mantemos (custo zero, ajuda o código gerado). Versões: as estáveis no momento da instalação, registradas no `package-lock.json`.

**Fluxo da tela inicial pelas camadas:**
- `engine/`: objeto `engine` sem React, com estado `{ status: 'idle' | 'starting' | 'ready' | 'error' }`, `subscribe(listener)`, `getState()` e `start()`, que chama `Tone.start()` e trata a rejeição (status `error`).
- `commands/`: `start()` delega para o engine. É a única porta de entrada para ações.
- `input/`: um único listener de `keydown` no `window`. Uma função pura `resolveCommand(code, repeat)` mapeia `event.code` → nome de comando, ignorando `repeat`. O listener é instalado uma vez na raiz do app.
- `ui/`: `useEngineState()` com `useSyncExternalStore(engine.subscribe, engine.getState)`. `StartScreen` (instrução + botão que chama `commands.start()`) e `DeckScreen` placeholder ("Mesa pronta").
- `storage/`: apenas `index.ts` comentado indicando que o esquema vem na change `persistencia-minima`. Alternativa descartada: criar um Dexie vazio agora — nada a guardar, e o esquema seria reescrito.

**Testes:** Vitest em ambiente `node`, só para `resolveCommand` (Espaço → `start`, repeat → nada, outras teclas → nada). Testar Tone/React exigiria jsdom e mocks; fora do que a arquitetura pede.

**`.gitignore`:** padrão do Vite + extensões de áudio (`*.mp3`, `*.wav`, `*.ogg`, `*.flac`, `*.m4a`, `*.aac`) e pasta `audio/`.

**`openspec/config.yaml`:** manter as linhas de idioma e acrescentar stack, estrutura de pastas, princípios (motor fora do React, mesmos comandos para teclado e mouse, `event.code`, quantização pelo Transport) e restrições da v1.

## Risks / Trade-offs

- [`npm create vite` em diretório não vazio pede confirmação] → gerar em pasta temporária dentro do repo e mover os arquivos para a raiz, sem tocar em `docs/`, `openspec/`, `.claude/`, `CLAUDE.md`, `README.md` e `.git/` (o README do template é descartado).
- [Template do Vite muda entre versões (ex.: config do ESLint)] → aceitar o que vier; só remover o conteúdo de demonstração (contador, logos).
- [`Tone.start()` pode resolver mas o contexto continuar `suspended` em casos raros] → considerar pronto só quando `Tone.getContext().state === 'running'`; senão, status `error`.
