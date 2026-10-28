# Design

## Context

Base pronta da `setup-stack`: `engine` com `status` e `start()`, `commands.start`, `resolveCommand(code, repeat)` mapeando só Espaço → `start`, e `DeckScreen` placeholder. Requisitos em `specs/beat-slots/spec.md`; motivação em proposal.md.

## Goals / Non-Goals

**Goals:**
- Troca sem atraso perceptível nem sobreposição, agendada no relógio de áudio (não em `setTimeout`).
- Lógica de tempo testável sem navegador.

**Non-Goals:**
- Atalho de teclado para abrir o seletor de arquivo (o botão de carregar é alcançável por Tab).
- Volume, crossfade, sincronizar a fase do novo beat com a do anterior (o novo sempre começa do início).

## Decisions

**Estado do engine (imutável, novo objeto a cada mudança):**
`{ status, bpm, playing, decks: DeckState[2], slots: (BeatFile | null)[8], bars: (4 | 8)[8], loading: boolean[8], message }`, com `DeckState = { current, queued: slot | 'stop' | null, lastSelected }` e `BeatFile = { fileName, duration }`; o BPM de cada slot é derivado de duração e compassos. `message` é uma dica transitória ("Carregue um beat primeiro", "O slot 7 está vazio", "Não foi possível ler o arquivo"), limpa na próxima ação. Os `Tone.Player` ficam num array privado do engine, fora do estado.

**Relógio:** o Transport do Tone.js com `bpm` = BPM da mesa e compasso 4/4. Ao tocar do silêncio: `transport.start(now)` e `player.start(now)` no mesmo instante, então os compassos do Transport ficam alinhados ao início do loop. Players com `loop = true`, não sincronizados ao Transport (`sync()` não é necessário para loops que só começam e param).

**Troca quantizada:** `transport.scheduleOnce(cb, '<ticks do próximo compasso>i')`, com o compasso calculado por `transport.ticks` e `PPQ * 4`. (`nextSubdivision('1m')` foi descartado: devolve tempo do contexto de áudio, e `scheduleOnce` espera tempo do Transport.) O callback recebe o `time` de áudio e faz `old.stop(time)` + `new.start(time)` — mesmo instante, sem gap nem sobreposição. A atualização visual (`currentSlot`, limpar `queuedSlot`) vai por `Tone.getDraw().schedule(..., time)` para a tela mudar quando o som muda. Nova seleção antes da troca: `transport.clear(id)` e reagenda. Alternativa descartada: `setTimeout` calculado — sofre jitter da thread principal.

**Dois decks:** deck = `floor(slot / 4)`. O engine guarda, por deck, o slot ativo no relógio de áudio e o id do evento agendado. Entrar, trocar e sair usam o mesmo agendamento no próximo compasso: o callback para o slot anterior do deck (se houver) e inicia o novo (se não for `'stop'`). Quando o último deck sai e não há outra entrada agendada, o callback também para o Transport e a tela marca a mesa como parada. Sair de um deck limpa o `lastSelected` dele, para o Espaço retomar só o que estava tocando. Alternativa descartada: Shift+número para camadas — mais escondido para iniciante; e decks fixos deixam claro o que pode tocar junto.

**Compassos por botões 4/8, não `<select>`:** com um select focado, digitar 8 mudaria o valor e também acionaria o slot 8.

**Carregamento:** `file.arrayBuffer()` → `Tone.getContext().decodeAudioData()`; erro de decodificação vira `message` e não toca no slot. Duração vem do buffer decodificado. O botão de carregar do slot que está tocando fica desabilitado (evita trocar o áudio sob o player ativo).

**Carregar vários:** `engine.loadDeck(deck, files)` calcula os slots vazios do deck e chama `loadSlot` em sequência (`await` um por um), para o primeiro arquivo definir o BPM da mesa de forma previsível. Como cada `loadSlot` limpa a mensagem, o `loadDeck` junta os nomes que falharam e monta um resumo no fim: primeiro os arquivos ilegíveis, depois quantos não couberam.

**BPM da mesa:** o engine guarda o índice do slot de referência (o primeiro carregado). `bpm` da mesa = BPM desse slot; se os compassos dele mudarem ou ele for substituído, o BPM da mesa acompanha e o Transport é atualizado.

**Lógica pura em `src/engine/tempo.ts`** (testada com Vitest): `computeBpm(duration, bars)`, `isBpmCompatible(bpm, ref)` (tolerância 2%), `deckOf(slot)` e `slotsToPlay(slots, lastSelectedPorDeck)`.

**Comandos com argumento:** `resolveCommand` passa a retornar `Command | null`, com `Command = { type: 'togglePlay' } | { type: 'selectSlot', slot: number }`, e `commands.execute(command)` despacha. Espaço vira `togglePlay`: se o áudio ainda não foi liberado, chama `engine.start()` (comportamento de `audio-start` intacto); senão alterna play/stop. `Digit1–8` e `Numpad1–8` → `selectSlot`. A UI chama os mesmos comandos.

**UI:** `DeckScreen` com cabeçalho (BPM da mesa, botão play/stop, dica atual) e duas linhas rotuladas "Deck A" e "Deck B" com 4 `SlotCard` cada (tecla, estado, nome, select 4/8, BPM, aviso, botão "Carregar" com `<input type="file" accept="audio/*">` oculto). Clique no card = `selectSlot`.

## Risks / Trade-offs

- [Loop com duração imprecisa (silêncio no fim do arquivo) gera BPM "quebrado"] → aceitável na v1; o BPM exibido deixa o problema visível.
- [Beats de BPM diferente saem de fase com os compassos] → previsto: aviso na tela; time-stretch está no backlog.
- [Arquivos grandes demoram a decodificar] → mostrar o slot como "carregando…" até terminar.
- [Mudar o BPM da mesa durante a reprodução desloca a grade de compassos] → aceitável; só acontece se o usuário mexer nos compassos do slot de referência.
