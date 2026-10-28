# Tasks

## 1. Lógica pura e teclado

- [x] 1.1 Generalizar `emptySlotsOfDeck` para `emptyIndices(items, loading, first, count)` em `tempo.ts`, atualizando os testes e cobrindo o caso dos 8 pads; verificar com `npm test`
- [x] 1.2 Adicionar `{ type: 'triggerPad'; pad }` ao `Command` e mapear `KeyQ KeyW KeyE KeyR KeyA KeyS KeyD KeyF` → 0–7 em `resolveCommand`, com testes incluindo repeat; verificar com `npm test`

## 2. Engine

- [x] 2.1 Extrair `decodeFile` e usá-lo em `loadSlot`; adicionar `pads`, `padLoading`, `padPlaying`, `loadPad` e `loadPads` (vazios em ordem, um por vez, resumo de falhas e "não couberam"/"pads cheios"); verificar com `npx tsc -b`
- [x] 2.2 Implementar `triggerPad` (start/restart imediato, dica de pad vazio), indicador "tocando" via `onstop` + `state`, e corte dos pads no `stop()` da mesa; ligar `commands.triggerPad/loadPad/loadPads` e o `execute`; verificar com `npx tsc -b`

## 3. Tela

- [x] 3.1 Renomear `DeckLoadButton` para `LoadManyButton({ onFiles })` e criar `PadsSection` + `PadCard` (letra, nome truncado, Carregar, destaque enquanto toca, clique dispara) abaixo dos decks; verificar com `npm run build` e `npm run lint`

## Workflow follow-up

- Leon testa os pads no navegador com os próprios samples (disparo na hora, reinício, dois pads juntos, Espaço cortando tudo).
- Arquivar a change após revisão (`/opsx:archive`), criando `openspec/specs/sample-pads/spec.md`.
