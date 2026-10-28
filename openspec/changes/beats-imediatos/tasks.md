# Tasks

## 1. Engine

- [x] 1.1 Trocar a fila por início imediato do começo do loop em `selectSlot` (entrar e trocar no mesmo `Tone.now()`; sair na hora, parando a mesa sem cortar pads se for o último deck) e remover `queued`, `switchEventIds`, `cancelSwitch`, `queue`, `Draw`, `activeSlots` e o `transport.start/stop`; verificar com `npx tsc -b`

## 2. Tela e docs

- [x] 2.1 Remover os estados "na fila"/"saindo" do `SlotCard` e suas classes CSS; verificar com `npm run build` e `npm run lint`
- [x] 2.2 Trocar o princípio "o som nunca atravessa" por "tudo entra na hora; o tempo é do DJ" em `docs/context.md`, `docs/architecture.md`, `openspec/config.yaml` e `CLAUDE.md` (removendo também as notas de agendamento/grade do Transport), e atualizar o Purpose de `openspec/specs/beat-slots/spec.md`; verificar com `grep -rn "atravessa"` sem resultados fora de `openspec/changes/archive`

## Workflow follow-up

- Leon testa no navegador: entrar com o Deck B no meio do compasso, trocar no Deck A com o B tocando, tirar um deck, tirar o último com um pad tocando.
- Arquivar a change após revisão (`/opsx:archive`), atualizando `openspec/specs/beat-slots/spec.md`.
