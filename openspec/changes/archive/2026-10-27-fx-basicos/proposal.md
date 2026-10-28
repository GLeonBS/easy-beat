# Proposal

## Why

Com beats e pads funcionando, falta o terceiro elemento da performance: mexer no som do beat ao vivo — abafar e soltar, ou fazer o beat ecoar numa virada — enquanto o MC rima. A v1 prevê filtro e eco. Junto vai o que restou da `keyboard-shortcuts` (os atalhos principais já entraram em `beat-slots` e `sample-pads`): uma legenda de teclas, para o iniciante não precisar decorar.

## What Changes

- Cada deck ganha **Filtro** e **Eco** próprios, aplicados a qualquer beat que estiver tocando nele. Pads não passam pelos efeitos.
- Teclas: **Z** filtro A, **X** eco A, **C** filtro B, **V** eco B; também por botões no cabeçalho de cada deck.
- **Modo por deck**, trocado pelo botão do deck ou pelas teclas **9** (Deck A) e **0** (Deck B):
  - **Manter** (padrão): apertar liga, apertar de novo desliga.
  - **Segurar**: o efeito fica ligado só enquanto a tecla/botão está pressionado.
- **Filtro** corta os agudos (som "abafado"). **Eco** repete o som do deck no ritmo da mesa; ao desligar, as repetições que já soam terminam naturalmente.
- **Legenda de teclas** fixa na tela da mesa.
- Fecha a change `keyboard-shortcuts` do plano: ela não será criada separadamente.

Fora desta change: intensidade ajustável dos efeitos, outros efeitos, efeitos nos pads, mapeamento de teclas personalizável (backlog).

## Capabilities

### New Capabilities
- `deck-effects`: filtro e eco por deck, com modos manter/segurar, por teclado e mouse.
- `key-legend`: legenda das teclas da mesa visível na tela.

### Modified Capabilities
<!-- Nenhuma: decks, slots e pads mantêm seus requisitos. -->

## Impact

- `src/engine/`: cadeia de áudio por deck (barramento → filtro → saída, com envio para eco), estado de efeitos e modos.
- `src/input/`: o listener passa a tratar também `keyup` (modo segurar) e perda de foco da janela; novas teclas Z X C V 9 0.
- `src/commands/`: comandos de efeito com "pressionar" e "soltar"; troca de modo.
- `src/ui/`: botões de efeito e modo no cabeçalho dos decks; legenda.
- Docs: plano de changes e mapa de teclas em `docs/architecture.md` e `CLAUDE.md`.
