# Tasks

## 1. Projeto base

- [x] 1.1 Criar `.gitignore` (padrão Vite + extensões de áudio e pasta `audio/`); verificar com `git check-ignore teste.mp3` e que `node_modules/` não aparece em `git status`
- [x] 1.2 Gerar o template Vite `react-ts` em pasta temporária e mover para a raiz sem sobrescrever `docs/`, `openspec/`, `.claude/`, `CLAUDE.md`, `README.md`; verificar com `git diff README.md` vazio e os demais intactos
- [x] 1.3 Remover o conteúdo de demonstração do template (contador, logos, CSS de exemplo); verificar que `npm run build` passa
- [x] 1.4 Instalar `tone` e `dexie`, e `vitest` como dev; adicionar script `"test": "vitest run"`; verificar que `npm install` termina sem erros

## 2. Camadas e tela inicial

- [x] 2.1 Criar `src/engine/` com estado `idle | starting | ready | error`, `subscribe`, `getState` e `start()` usando `Tone.start()`; verificar com `npx tsc --noEmit`
- [x] 2.2 Criar `src/commands/` com `start()` delegando ao engine; verificar com `npx tsc --noEmit`
- [x] 2.3 Criar `src/input/` com `resolveCommand(code, repeat)` puro e o listener único de `keydown`; testes Vitest cobrindo Espaço, repeat e tecla qualquer; verificar com `npm test`
- [x] 2.4 Criar `src/ui/` com `useEngineState`, `StartScreen` (instrução, botão, mensagem de erro) e `DeckScreen` placeholder, ligados em `App`; verificar com `npm run build`
- [x] 2.5 Criar `src/storage/index.ts` apenas como marcador para `persistencia-minima`

## 3. Configuração e docs

- [x] 3.1 Preencher o `context` de `openspec/config.yaml` com stack, estrutura, princípios e restrições da v1; verificar com `openspec validate setup-stack`
- [x] 3.2 Atualizar `CLAUDE.md` com os comandos reais (`dev`, `build`, `test`, `lint`, teste único com `npx vitest run <arquivo> -t "<nome>"`) e remover o aviso de "sem código"

## 4. Verificação integrada

- [x] 4.1 Com `npm run dev`, no Chrome: tela inicial aparece sem som; Espaço leva à tela da mesa; recarregar e repetir clicando no botão; segurar Espaço não gera erro no console

## Workflow follow-up

- Arquivar a change após revisão (`/opsx:archive`), criando `openspec/specs/audio-start/spec.md`.
