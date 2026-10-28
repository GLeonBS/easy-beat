# Design

## Context

`src/storage/index.ts` é só um marcador; Dexie 4 já está no `package.json`. No engine, `loadSlot(slot, file)` e `loadPad(pad, file)` decodificam com `decodeFile` e criam os players; o slot de referência do BPM é o primeiro carregado (`referenceSlot`). Áudio só existe após `engine.start()`. Requisitos em `specs/deck-persistence/spec.md`.

## Goals / Non-Goals

**Goals:**
- Restaurar a mesa sem nenhuma ação extra além do Espaço inicial.
- Falha no banco nunca impede tocar.

**Non-Goals:**
- Migrações de esquema elaboradas (v1: versão 1 do banco).
- Testar o Dexie em si (exigiria `fake-indexeddb`, dependência nova); os testes cobrem a lógica pura.

## Decisions

**Banco (`src/storage/`):** Dexie `easybeat`, versão 1, tabelas `slots` (chave `index`) e `pads` (chave `index`). Registro: `{ index, fileName, blob, savedAt }` e, em slots, `bars`. O `File` é guardado como `Blob` (IndexedDB aceita nativamente). Funções: `saveSlot`, `saveSlotBars`, `savePad`, `loadSaved()` → `{ slots, pads }`, `deleteSlot`, `deletePad`, `clearAll()`. O engine importa só essas funções; nada de Dexie fora de `storage/`.

**Quando salvar:** depois que `loadSlot`/`loadPad` decodificam com sucesso (arquivo inválido nunca é salvo). `setBars` chama `saveSlotBars`. Falha de escrita vira `message` ("… não será lembrado na próxima vez") sem desfazer o carregamento. Escritas não bloqueiam o som: o engine não espera o banco para criar o player.

**Restaurar:** no fim de `engine.start()`, depois das cadeias de efeito: `loadSaved()`, ordenar slots por `savedAt` (função pura `restoreOrder`, testada) e carregar um por vez pelo mesmo caminho de `loadSlot`, sem salvar de novo (parâmetro interno `persist: false`), aplicando os `bars` salvos; depois os pads. Assim o primeiro carregado volta a ser o `referenceSlot` e o BPM da mesa se repete. Falha de decodificação: apaga o registro e acumula o nome na mensagem final. A tela da mesa aparece já durante a restauração, com os slots em "carregando…".

**`savedAt` ao substituir:** substituir um slot grava `savedAt` novo. Se o slot substituído era a referência, a ordem de restauração pode eleger outra referência — coerente com a sessão, onde substituir o slot de referência também muda o BPM.

**Limpar mesa:** botão no cabeçalho com `window.confirm("Limpar a mesa? Os beats e samples salvos serão apagados.")`. Confirmado: `stop()` da mesa, `dispose` de todos os players, `referenceSlot = null`, estado de slots/pads/compassos/BPM/decks zerado (efeitos desligados) e `clearAll()`. Sem atalho de teclado (ação destrutiva); acessível por Tab.

## Risks / Trade-offs

- [Arquivos grandes enchem a cota do navegador] → aviso por arquivo; o resto segue funcionando.
- [`window.confirm` é feio] → aceitável na v1; é nativo, acessível e bloqueia cliques acidentais.
- [Restaurar muitos arquivos grandes demora] → um por vez com "carregando…" visível; a mesa já é usável com o que já voltou.
