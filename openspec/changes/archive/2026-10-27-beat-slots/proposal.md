# Proposal

## Why

Hoje o app só libera o áudio e mostra "Mesa pronta". O núcleo da v1 é tocar beats em loop e trocar entre eles no tempo certo, sem o som "atravessar" — é o que torna o EasyBeat uma mesa de DJ. Todas as próximas changes (pads, FX) dependem de haver um beat tocando sobre um relógio musical.

## What Changes

- Tela da mesa com **8 slots de beat**, numerados 1–8, em **dois decks**: Deck A (1–4) e Deck B (5–8). Cada deck toca um beat; os dois podem tocar juntos, então até **2 sons ao mesmo tempo**.
- Carregar um arquivo de áudio do computador em cada slot, ou vários de uma vez nos slots vazios de um deck, informando se o loop tem **4 ou 8 compassos**; o BPM é calculado pela duração.
- O **primeiro beat carregado define o BPM da mesa**; beats com BPM diferente continuam utilizáveis, mas mostram aviso.
- **Play/stop** de toda a mesa pela tecla Espaço ou botão na tela.
- **Troca de beat quantizada no próximo compasso**, por deck, pelas teclas 1–8 (fila de cima ou teclado numérico) ou clicando no slot. Um deck parado entra no próximo compasso; apertar o beat que já toca tira aquele deck no próximo compasso. A tela mostra o que está tocando, na fila e saindo.
- Arquivo inválido gera mensagem simples e o slot continua como estava.

Fora desta change: samples/pads, efeitos, salvar slots entre sessões (recarregar a página perde os beats), detecção automática de BPM, time-stretch, quantização configurável.

## Capabilities

### New Capabilities
- `beat-slots`: carregar loops em slots, dois decks simultâneos, BPM da mesa, tocar/parar e trocar de beat no tempo musical, pelo teclado e pelo mouse.

### Modified Capabilities
<!-- Nenhuma: o comportamento de `audio-start` (Espaço na tela inicial) não muda. -->

## Impact

- `src/engine/`: relógio (Transport do Tone.js), players por slot, agendamento da troca.
- `src/commands/`: novos comandos de play/stop, troca de slot e carregamento.
- `src/input/`: mapa de teclas ganha Espaço como play/stop na mesa e Digit/Numpad 1–8.
- `src/ui/`: a tela da mesa substitui o placeholder `DeckScreen`.
- Sem novas dependências.
