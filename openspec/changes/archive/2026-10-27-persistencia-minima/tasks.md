# Tasks

## 1. Banco e lógica pura

- [x] 1.1 Implementar `src/storage/index.ts` com Dexie (`easybeat` v1, tabelas `slots` e `pads`) e as funções `saveSlot`, `saveSlotBars`, `savePad`, `loadSaved`, `deleteSlot`, `deletePad`, `clearAll`; verificar com `npx tsc -b`
- [x] 1.2 Criar a função pura `restoreOrder` (slots salvos ordenados por `savedAt`) com testes; verificar com `npm test`

## 2. Engine

- [x] 2.1 Salvar após carregar slot/pad com sucesso e ao mudar compassos, com mensagem em caso de falha sem desfazer o carregamento; verificar com `npx tsc -b`
- [x] 2.2 Restaurar no fim de `engine.start()` (slots em `restoreOrder` com os compassos salvos, depois pads; sem regravar; registros ilegíveis apagados e avisados); verificar com `npx tsc -b`
- [x] 2.3 Implementar `clearDeck` (parar tudo, descartar players, zerar estado e referência de BPM, apagar o banco) e o comando correspondente; verificar com `npx tsc -b`

## 3. Tela e docs

- [x] 3.1 Botão "Limpar mesa" no cabeçalho com `window.confirm`; verificar com `npm run build` e `npm run lint`
- [x] 3.2 Registrar no `CLAUDE.md` o que é persistido e onde (`storage/`, só via funções do repositório); verificar que o texto bate com o código

## Workflow follow-up

- Leon testa no navegador: carregar beats e pads, mudar compassos, recarregar a página e conferir a mesa restaurada com o mesmo BPM; "Limpar mesa" cancelado e confirmado; recarregar após limpar.
- Arquivar a change após revisão (`/opsx:archive`), criando `openspec/specs/deck-persistence/spec.md`.
