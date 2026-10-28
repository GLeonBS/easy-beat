# Design

## Context

Hoje todos os `Tone.Player` (slots e pads) vão direto para `toDestination()`. O input tem um único listener de `keydown` que chama `resolveCommand(code, repeat)` → `commands.execute`. `DeckState = { current, lastSelected }`. O BPM da mesa fica em `state.bpm` e em `transport.bpm` (o Transport não roda). Requisitos em `specs/deck-effects` e `specs/key-legend`.

## Goals / Non-Goals

**Goals:**
- Efeitos sem estalos e sem cortar o rabo do eco.
- Modo segurar confiável: nunca deixar um efeito "preso" ligado se o `keyup` se perder.
- Legenda que não pode divergir do mapa de teclas.

**Non-Goals:**
- Intensidade ajustável, outros efeitos, efeitos nos pads.

## Decisions

**Cadeia por deck (criada em `engine.start()`, depois de `Tone.start()`):**
`players do deck → bus (Gain) → filter (Filter lowpass) → Destination`, e `filter → echoSend (Gain 0/0,35) → delay (FeedbackDelay, wet 1, feedback 0,25) → Destination`. Os players de slot passam a se conectar ao `bus` do seu deck; pads continuam em `toDestination()`. O eco é um **envio**: desligar fecha só a entrada do delay, então as repetições já dentro dele somem sozinhas. Alternativa descartada: mexer no `wet` do delay — cortaria o rabo do eco.

**Filtro:** ligado = `frequency.rampTo(400, 0.05)`; desligado = `rampTo(20000, 0.05)`. A rampa de 50 ms evita estalos.

**Eco:** `echoSend.gain.rampTo(0.35|0, 0.02)` — o envio a 0,35 (~−9 dB) deixa só a parte ecoada mais baixa, e o feedback 0,25 limita a ~3 repetições audíveis (ajustado após teste do Leon: 1 e 0,45 soavam pesados demais). `delayTime = 60 / bpm × 0.75` (colcheia pontuada), com 120 BPM quando a mesa não tem BPM e teto de 1,5 s (o delay é criado com `maxDelay` 2 s; um loop mal cortado gera BPMs absurdos, como 16,9, que dariam 2,7 s); atualizado sempre que o BPM da mesa muda (no mesmo ponto em que `applyBpm` é chamado).

**Estado:** `DeckState` ganha `filter: boolean`, `echo: boolean`, `mode: 'manter' | 'segurar'`.

**Lógica pura em `src/engine/effects.ts`** (testada): `effectAfter(on, mode, action: 'press' | 'release')` — manter: press inverte, release mantém; segurar: press liga, release desliga — e `echoDelaySeconds(bpm)`.

**Comandos:** `{ type: 'effectPress' | 'effectRelease'; deck; effect: 'filter' | 'echo' }` e `{ type: 'toggleEffectMode'; deck }`, mais `commands.releaseHeldEffects()` (desliga os efeitos dos decks em modo segurar). Trocar o modo desliga os efeitos do deck.

**Input:** além do `keydown`, um listener de `keyup` usa `resolveRelease(code)` (só Z X C V geram `effectRelease`) e um de `blur` na janela chama `releaseHeldEffects`. O princípio "um único listener" passa a ser "um único ponto de entrada de teclado em `input/`" (keydown + keyup + blur no mesmo módulo).

**Mouse:** botões de efeito usam `onPointerDown` → press e `onPointerUp`/`onPointerLeave` → release (assim o modo segurar funciona com o mouse); `onClick` não é usado neles, para Espaço/Enter num botão focado não dispararem efeito em dobro.

**Legenda derivada do mapa:** `input/keymap.ts` exporta `KEY_LEGEND` (tecla exibida, `event.code` de exemplo, descrição). Um teste percorre a legenda e confere que cada `code` resolve para um comando — a legenda não consegue apontar uma tecla morta. A UI renderiza `KEY_LEGEND` numa barra fixa no rodapé (`position: sticky; bottom: 0`), sempre visível.

**Teclas:** Z X / C V = filtro/eco dos decks A/B; 9 / 0 = modo dos decks A/B (logo depois de 1–8).

## Risks / Trade-offs

- [Filtro em 400 Hz pode abafar demais alguns beats] → valor fixo na v1; intensidade ajustável fica para depois.
- [`keyup` perdido (ex.: Alt+Tab)] → `blur` libera os efeitos segurados.
- [Barra fixa da legenda cobre conteúdo no fim da página] → `position: sticky` no fim da mesa: só cobre enquanto há conteúdo abaixo para rolar, e nunca esconde o fim.
