# Tasks

## 1. Lógica de tempo

- [x] 1.1 Criar `src/engine/tempo.ts` com `computeBpm`, `isBpmCompatible` (2%) e `pickSlotToPlay`; testes Vitest cobrindo 8 s/4 compassos = 120, 8 compassos = 240, 90 vs 91 compatível, 90 vs 100 incompatível, escolha do menor slot e do último selecionado; verificar com `npm test`

## 2. Comandos e teclado

- [x] 2.1 Trocar `resolveCommand` para retornar `Command | null` (Espaço → `togglePlay`, `Digit1–8`/`Numpad1–8` → `selectSlot`, repeat → nada) e atualizar os testes; verificar com `npm test`
- [x] 2.2 Criar `commands.execute(command)` e `commands.loadSlot/setBars`; `togglePlay` chama `engine.start()` quando o áudio ainda não foi liberado; atualizar o listener e a `StartScreen`; verificar com `npx tsc -b`

## 3. Engine

- [x] 3.1 Ampliar o estado do engine (slots, bpm, playing, currentSlot, queuedSlot, lastSelected, message) e implementar carregamento com decodificação, erro de arquivo e BPM da mesa pelo slot de referência; verificar com `npx tsc -b`
- [x] 3.2 Implementar play/stop e seleção com a mesa parada (início imediato, dicas de "sem beats" e "slot vazio"); verificar com `npx tsc -b`
- [x] 3.3 Implementar troca quantizada no tick do próximo compasso, reagendamento ao mudar a fila, cancelamento ao selecionar o beat atual e atualização visual via `Draw`; verificar com `npx tsc -b`

## 4. Tela da mesa

- [x] 4.1 Implementar `DeckScreen` (BPM da mesa, play/stop, dica) e `SlotCard` (tecla, estado incluindo "carregando…" e "na fila", nome, select 4/8, BPM, aviso, botão Carregar desabilitado no slot que toca); verificar com `npm run build` e `npm run lint`

## 5. Verificação integrada

- [x] 5.1 Gerar loops de teste fora do repo (ex.: 8,0 s e ~7,2 s com cliques por tempo) e, no Chrome, conferir cada cenário da spec: carregar, BPM 120, aviso de BPM, arquivo inválido, play/stop por Espaço e botão, teclas 1–8 e Numpad, fila substituída, troca exatamente no compasso sem sobreposição, slot vazio; sem erros no console
- [x] 5.2 Atualizar `CLAUDE.md` se surgir algo não óbvio sobre o agendamento no Transport; verificar que o texto bate com o código

## 6. Dois decks e ajustes da revisão

- [x] 6.1 Truncar nomes longos de arquivo no card (grade com `minmax(0, 1fr)`, nome completo no `title`); verificar com `npm run build`
- [x] 6.2 Trocar `pickSlotToPlay` por `deckOf` e `slotsToPlay` em `tempo.ts`, com testes cobrindo deck de cada slot, retomada dos dois decks e fallback para o menor slot; verificar com `npm test`
- [x] 6.3 Passar o engine para estado por deck: entrada de deck parado, troca e saída agendadas no próximo compasso, parada da mesa quando o último deck sai, Espaço retomando os dois; verificar com `npx tsc -b`
- [x] 6.4 Mostrar os slots em duas linhas "Deck A"/"Deck B" e o estado "saindo"; verificar com `npm run build` e `npm run lint`
- [x] 6.5 Implementar `engine.loadDeck`/`commands.loadDeck` e o botão "Carregar vários" (input `multiple`) em cada deck, preenchendo slots vazios em ordem, com mensagens de "não couberam" e "deck cheio"; teste Vitest da função pura que escolhe os slots vazios; verificar com `npm test`, `npm run build` e `npm run lint`

## Workflow follow-up

- Leon testa os cenários de dois decks no navegador com os próprios beats.

- Arquivar a change após revisão (`/opsx:archive`), criando `openspec/specs/beat-slots/spec.md`.
