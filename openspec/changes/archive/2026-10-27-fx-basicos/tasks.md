# Tasks

## 1. Lógica pura e teclado

- [x] 1.1 Criar `src/engine/effects.ts` com `effectAfter` e `echoDelaySeconds`, com testes (manter: press inverte/release mantém; segurar: press liga/release desliga; 120 BPM = 0,375 s; sem BPM = 0,375 s); verificar com `npm test`
- [x] 1.2 Mapear Z X C V → `effectPress`, 9/0 → `toggleEffectMode` em `resolveCommand`; criar `resolveRelease` (Z X C V → `effectRelease`) e `KEY_LEGEND`, com testes incluindo repeat e a coerência legenda→comando; verificar com `npm test`

## 2. Engine e comandos

- [x] 2.1 Criar a cadeia por deck em `engine.start()` (bus → filtro → saída, envio → eco → saída), conectar os players de slot ao bus do deck e atualizar o tempo do eco junto com o BPM; verificar com `npx tsc -b`
- [x] 2.2 Adicionar `filter`/`echo`/`mode` ao `DeckState` e implementar `effectPress`, `effectRelease`, `toggleEffectMode` (desligando efeitos) e `releaseHeldEffects`, com rampas; ligar os comandos e o `execute`; verificar com `npx tsc -b`
- [x] 2.3 Adicionar listeners de `keyup` e `blur` em `input/`; verificar com `npx tsc -b`

## 3. Tela e docs

- [x] 3.1 Botões Filtro/Eco (pointer down/up/leave) e seletor de modo no cabeçalho de cada deck, mostrando estado e tecla; verificar com `npm run build` e `npm run lint`
- [x] 3.2 Barra de legenda fixa no rodapé renderizada de `KEY_LEGEND`, com espaço no fim da mesa; verificar com `npm run build` e `npm run lint`
- [x] 3.3 Atualizar `docs/architecture.md` e `CLAUDE.md`: plano de changes sem `keyboard-shortcuts`, mapa de teclas final e o princípio de entrada de teclado (keydown + keyup + blur em `input/`); verificar que o mapa nos docs bate com `KEY_LEGEND`

## Workflow follow-up

- Leon testa no navegador: filtro e eco em cada deck, modo manter e segurar (teclado e mouse), troca de modo com efeito ligado, Alt+Tab segurando um efeito, eco não afetando pads.
- Arquivar a change após revisão (`/opsx:archive`), criando `openspec/specs/deck-effects/spec.md` e `openspec/specs/key-legend/spec.md`.
