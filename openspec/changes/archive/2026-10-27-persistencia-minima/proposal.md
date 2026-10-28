# Proposal

## Why

Hoje recarregar a página ou reabrir o app perde todos os beats e samples, e o Leon precisa escolher os arquivos de novo a cada sessão. A v1 prevê persistência mínima em banco local; o mínimo útil é a mesa voltar montada como estava.

## What Changes

- Áudios carregados nos **slots** (com os compassos 4/8) e nos **pads** são salvos no banco local do navegador (IndexedDB), junto com o próprio arquivo.
- Ao começar (Espaço na tela inicial), a mesa **restaura** os áudios salvos nas mesmas posições, na ordem em que foram carregados, de modo que o BPM da mesa volta igual. A mesa começa parada, com efeitos desligados.
- Botão **"Limpar mesa"**, com confirmação: para tudo, esvazia slots e pads e apaga o que estava salvo.
- Se salvar ou restaurar falhar, a mesa avisa e continua funcionando na sessão.

Fora desta change: salvar estado de reprodução, efeitos ou modos; várias mesas/sets salvos; remover um único slot (substituir já cobre); exportar/importar.

## Capabilities

### New Capabilities
- `deck-persistence`: salvar e restaurar os áudios da mesa entre sessões, e limpar a mesa salva.

### Modified Capabilities
<!-- Nenhuma: carregar, tocar e efeitos mantêm seus requisitos; a persistência acontece por trás deles. -->

## Impact

- `src/storage/`: banco Dexie com tabelas de slots e pads.
- `src/engine/`: salvar ao carregar e ao mudar compassos; restaurar no `start()`; `clearDeck`.
- `src/commands/` e `src/ui/`: comando e botão "Limpar mesa".
- Sem dependência nova (Dexie já instalado no `setup-stack`).
