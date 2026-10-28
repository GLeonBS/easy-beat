# Design

## Context

Base de `beat-slots`: engine com estado imutável e players privados por slot, `commands.execute(Command)`, `resolveCommand` por `event.code`, `emptySlotsOfDeck` e `DeckLoadButton` (input `multiple`) para "Carregar vários". Requisitos em `specs/sample-pads/spec.md`; motivação e a decisão de não quantizar em proposal.md.

## Goals / Non-Goals

**Goals:**
- Disparo com a menor latência possível (buffer já decodificado, `start` no `Tone.now()`).
- Reaproveitar o fluxo de carregamento dos slots, sem duplicar a lógica de decodificação.

**Non-Goals:**
- Volume, envelope ou fade nos pads; corte com clique audível ao reiniciar é aceito na v1.
- Agendar pads no Transport (decisão: imediato).

## Decisions

**Estado:** o engine ganha `pads: (BeatFile | null)[8]`, `padLoading: boolean[8]` e `padPlaying: boolean[8]`; players de pad num array privado, separado dos de slot, com `loop = false`.

**Disparo:** `triggerPad(pad)` chama `player.restart(Tone.now())` se o player está tocando, senão `player.start(Tone.now())`. O `restart` do Tone para só a fonte mais recente e cria outra, então nunca há duas cópias do mesmo pad. Pads não dependem do status de reprodução da mesa nem do Transport.

**Indicador "tocando":** `padPlaying[pad] = true` no disparo. O `onstop` do Player dispara a cada fonte que termina, inclusive a cortada por um `restart`; por isso ele agenda `setTimeout(0)` e só marca `false` se `player.state === 'stopped'` — depois de um restart o estado já é `started` e o indicador não pisca.

**Parar a mesa:** o `stop()` existente passa a chamar `stop()` em todos os players de pad. Tocar a mesa não mexe nos pads.

**Carregamento compartilhado:** extrair `decodeFile(file)` (arrayBuffer → `decodeAudioData` → `{ buffer, beat }`) usado por `loadSlot` e `loadPad`. `loadPads(files)` segue o padrão de `loadDeck`: pads vazios em ordem, um arquivo por vez, resumo de falhas e de "não couberam" no fim. A função pura de vazios é generalizada para `emptyIndices(items, loading, first, count)`, usada por decks (`first = deck * 4`) e pads (`first = 0, count = 8`); `emptySlotsOfDeck` sai.

**Teclado:** `Command` ganha `{ type: 'triggerPad'; pad }`; `resolveCommand` mapeia `KeyQ KeyW KeyE KeyR KeyA KeyS KeyD KeyF` → pads 0–7 por tabela.

**UI:** `DeckLoadButton` vira `LoadManyButton({ onFiles })`, usado por decks e pads. Nova `PadsSection` abaixo dos decks: cabeçalho "Pads" + "Carregar vários", grade 4×2 de `PadCard` (letra, nome truncado, botão "Carregar", destaque enquanto toca). Clique no card = `triggerPad`.

## Risks / Trade-offs

- [Pads sem quantização podem soar fora do tempo] → decisão do usuário; o princípio de `context.md` segue valendo para beats.
- [Reiniciar no meio do som pode gerar clique] → aceitável na v1; um fade curto fica para depois, se incomodar.
- [Samples longos (músicas inteiras) ocupam memória decodificada] → aceitável para uso local; sem limite de duração na v1.
