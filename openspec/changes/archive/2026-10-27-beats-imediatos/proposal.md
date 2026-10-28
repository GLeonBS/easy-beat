# Proposal

## Why

Testando a mesa, esperar o próximo compasso para um beat entrar deixa a resposta lenta; os pads, que tocam na hora, deixaram o contraste evidente. O Leon quer controlar o tempo no ouvido, como um DJ faz: o beat deve entrar no instante do clique ou da tecla, do começo do loop, sem a mesa corrigir nada.

## What Changes

- Selecionar um slot com a mesa tocando (clique ou teclas 1–8) faz o beat **entrar na hora, do início do loop**. Vale para **entrar** num deck parado e para **trocar** de beat dentro de um deck.
- Selecionar o slot que está tocando **tira o deck na hora** (antes: no próximo compasso). Se nenhum deck continuar tocando, a mesa para (sem cortar os pads).
- **BREAKING (comportamento):** a mesa deixa de alinhar os beats. Acertar o tempo entre os decks passa a ser do usuário, no ouvido. Deixam de existir a fila e os estados "na fila" e "saindo".
- O princípio "o som nunca atravessa" sai de `docs/context.md`, `docs/architecture.md`, `openspec/config.yaml` e `CLAUDE.md`, substituído por "tudo entra na hora; o tempo é do DJ".
- Com a mesa parada, selecionar um slot continua começando o beat do início, e o Espaço continua igual. BPM e aviso de BPM diferente continuam, como referência.

Fora desta change: sincronização automática, quantização configurável, crossfade, time-stretch.

## Capabilities

### New Capabilities
<!-- Nenhuma. -->

### Modified Capabilities
- `beat-slots`: entrada, troca e saída de deck passam de "no próximo compasso" para "na hora, do início do loop"; decks deixam de ser alinhados pela mesa; slots perdem os estados "na fila" e "saindo".

## Impact

- `src/engine/`: troca do agendamento no Transport por início imediato; remoção da fila por deck e do uso do Transport como grade.
- `src/ui/SlotCard.tsx` e CSS: remoção dos estados "na fila" e "saindo".
- Docs: princípio de tempo em `docs/context.md`, `docs/architecture.md`, `openspec/config.yaml`, `CLAUDE.md`; Purpose da spec principal `beat-slots`.
