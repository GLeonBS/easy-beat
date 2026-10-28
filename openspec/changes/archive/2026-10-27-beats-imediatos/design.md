# Design

## Context

Antes desta change, `selectSlot` com a mesa tocando agendava no Transport (`scheduleOnce` no tick do próximo compasso) a parada do slot anterior e o início do novo, com `queued`/`'stop'` no estado e atualização visual via `Draw`. A grade de compassos nascia em `play()` com `transport.start(now)`. Requisitos em `specs/beat-slots/spec.md`; motivação em proposal.md.

## Goals / Non-Goals

**Goals:**
- Resposta imediata em entrar, trocar e sair.
- Remover a fila e a grade por completo (estado, agendamento, UI), sem deixar código morto.

**Non-Goals:**
- Qualquer alinhamento automático entre decks (decisão do usuário: tempo no ouvido).
- Crossfade na troca (corte seco, como antes).

## Decisions

**Início imediato do começo do loop:** `switchDeck(deck, alvo | null)` usa um único `now = Tone.now()`: `players[anterior].stop(now)` e `players[alvo].start(now)`, no mesmo instante, sem offset. Alternativa descartada (primeira versão desta change): começar no ponto do loop alinhado à grade (`syncedOffset`) — o usuário preferiu controlar o tempo no ouvido.

**Sem Transport como relógio:** com nada agendado, a grade não serve a ninguém; `play()` e a parada deixam de chamar `transport.start/stop`. O BPM da mesa continua calculado e aplicado em `transport.bpm` (referência e base para efeitos sincronizados em `fx-basicos`), mas o Transport não roda.

**Sair na hora:** `players[slot].stop(now)`; se nenhum deck ficar ativo, `stopDecks()` marca a mesa como parada **sem cortar os pads** — a spec `sample-pads` liga o corte dos pads a parar pelo Espaço/botão. O `stop()` da mesa passa a ser `stopDecks()` + corte dos pads.

**Remoções:** `DeckState.queued`, `switchEventIds`, `cancelSwitch`, `queue`, o uso de `Draw` e `activeSlots` (o estado é atualizado na hora do comando, então `decks[].current` basta); no `SlotCard`, os estados "na fila"/"saindo" e as classes CSS `.slot-na-fila`/`.slot-saindo`.

**Mesa parada:** sem mudança — `play([slot])` inicia o beat do início.

## Risks / Trade-offs

- [Decks fora de fase se o usuário errar o tempo] → decisão do usuário; é a habilidade que o DJ pratica. O aviso de BPM diferente continua ajudando a escolher loops compatíveis.
- [Corte seco no meio do loop pode gerar clique] → aceitável na v1, como nos pads.
