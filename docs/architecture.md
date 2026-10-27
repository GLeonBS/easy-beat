# Arquitetura e Stack — EasyBeat (v1)
 
Status: **aprovado em 27/10/2026**
 
## Decisão
SPA em **TypeScript + Vite + React**, com motor de áudio em **Tone.js** (Web Audio API) e banco local em **IndexedDB via Dexie**. **Sem backend.**
 
## Stack
 
| Camada | Escolha | Motivo |
|---|---|---|
| Linguagem | TypeScript | Tipos ajudam specs e código gerado |
| Build/dev | Vite | Sobe com `npm run dev`, zero config |
| UI | React | Ecossistema conhecido; UI simples |
| Áudio | Tone.js | Relógio musical (Transport), agendamento quantizado, players e efeitos prontos |
| Banco local | IndexedDB + Dexie | Banco local no navegador; guarda áudios como Blob; sem servidor |
| Testes | Vitest | Apenas lógica pura (quantização, cálculo de BPM, mapa de teclas) |
| Navegador alvo | Chrome/Edge | Menor latência de áudio; compatível com Keyboard Lock (backlog) |
 
### Alternativa descartada
Node + Fastify + SQLite: exigiria API, upload de arquivos e mais um processo, sem ganho na v1. Reavaliar só se surgir necessidade real de backend.
 
## Estrutura
 
```
src/
  engine/    motor de áudio (Tone.js): relógio, slots de beat, pads de sample, FX
             não conhece React; expõe comandos e emite eventos de estado
  commands/  ações nomeadas: switchBeat(n), triggerSample(n), toggleFx(x), stop()...
  input/     teclado e mouse → commands (um único listener de keydown)
  ui/        React; lê estado do engine via useSyncExternalStore
  storage/   repositório Dexie (o que salvar é definido em change própria)
```
 
## Princípios de arquitetura
- **Motor independente da UI:** estado de áudio fora do state do React; rerender nunca atrasa o som.
- **Teclado e mouse disparam os mesmos comandos:** garante "toda ação pelo teclado" e deixa o remapeamento futuro barato (só trocar a tabela tecla→comando).
- **Teclas por `event.code`** (posição física, funciona igual no ABNT2); ignorar `event.repeat`.
- **Tudo quantizado pelo Transport:** trocas de beat são agendadas para o próximo compasso (ou 4/8) — o som nunca "atravessa".
- **Áudios decodificados ao carregar,** não ao tocar — pads respondem na hora.
## Limitações do navegador (decisões da v1)
1. **Sem detecção automática de BPM.** O usuário informa quantos compassos o loop tem (4 ou 8); o BPM é calculado pela duração.
2. **Sem time-stretch.** O primeiro beat define o BPM; beats com BPM diferente geram aviso. (Backlog.)
3. **Áudio só inicia após gesto do usuário.** Tela inicial: "Pressione Espaço para começar".
## Mapa de teclas padrão (proposta inicial)
- `1`–`8`: slots de beat (troca quantizada)
- `Q W E R` / `A S D F`: pads de sample
- `Espaço`: play/stop
- Detalhes finais definidos na change `keyboard-shortcuts`.
## Plano de changes (OpenSpec)
1. `setup-stack` — projeto Vite/TS/React/Tone/Dexie + config do OpenSpec com esta stack
2. `beat-slots` — carregar loops e trocar quantizado (núcleo)
3. `sample-pads` — samples por cima
4. `keyboard-shortcuts` — mapa padrão
5. `fx-basicos` — filtro e echo
6. `persistencia-minima` — o que salvar
**Ordem de corte se o prazo apertar:** 5, depois 6 (sem persistência = recarregar arquivos a cada sessão).