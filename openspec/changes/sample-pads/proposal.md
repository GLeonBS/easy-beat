# Proposal

## Why

A mesa já toca e troca beats em dois decks, mas falta o que dá vida à performance: soltar sons curtos (vinhetas, vozes, scratches, efeitos) por cima do beat, no improviso, enquanto o MC rima. É o próximo item do núcleo da v1.

## What Changes

- Seção **Pads** na tela da mesa com **8 pads**, nas teclas **`Q W E R` / `A S D F`** (posição física).
- Carregar um arquivo de áudio por pad, ou **vários de uma vez** nos pads vazios.
- Tecla ou clique no pad **toca o sample na hora, do início até o fim** (sem loop). Funciona com a mesa tocando ou parada.
- Apertar de novo um pad que ainda toca **reinicia** o sample. Pads diferentes soam juntos, por cima dos decks.
- **Parar a mesa (Espaço/botão) também corta os pads** que estiverem tocando.
- Pad vazio ou arquivo inválido mostram dica simples, sem afetar o que toca.

**Decisão consciente:** os samples tocam **imediatamente, sem quantização**. Isso diverge do princípio "entradas de sample acontecem no tempo musical certo" de `docs/context.md`; foi escolhido para os pads responderem na hora, como num pad físico. O princípio continua valendo para as trocas de beat.

Fora desta change: volume por pad, pads em loop, quantização de samples, efeitos, salvar pads entre sessões.

## Capabilities

### New Capabilities
- `sample-pads`: carregar samples em 8 pads e dispará-los na hora por teclado ou mouse, por cima dos decks.

### Modified Capabilities
<!-- Nenhuma: os requisitos de `beat-slots` não mudam; o corte dos pads ao parar a mesa é requisito de `sample-pads`. -->

## Impact

- `src/engine/`: players de pad, disparo e corte.
- `src/commands/` e `src/input/`: comando `triggerPad` e teclas `KeyQ KeyW KeyE KeyR KeyA KeyS KeyD KeyF`.
- `src/ui/`: seção de pads; o botão "Carregar vários" passa a ser reutilizado por decks e pads.
- Sem novas dependências.
