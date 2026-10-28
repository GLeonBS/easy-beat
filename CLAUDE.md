# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Fontes de verdade: `docs/context.md` (produto, escopo da v1, backlog), `docs/architecture.md` (stack e decisões), `docs/instructions.md` (como trabalhar).

## O projeto

EasyBeat: mesa de DJ no navegador para iniciantes — beats em loop trocados ao vivo no tempo certo, com samples e efeitos por cima. Uso pessoal e local. Também serve como teste do **OpenSpec** (SDD).

**Meta: v1 funcional até quinta, 29/10/2026.** Diante de risco de prazo, corta-se escopo, não se estende a data.

## Como trabalhar

- **Responder em português**, de forma direta e curta.
- **SDD com OpenSpec é obrigatório:** nenhuma implementação sem change/spec aprovada. Fluxo: proposal + tasks + deltas de spec → aprovação → implementar → arquivar a change atualizando as specs. Uma capacidade por change.
- OpenSpec 1.15 (CLI global `openspec`) já inicializado: `openspec/` (specs, changes, `config.yaml` em pt-BR) e comandos `/opsx:propose`, `/opsx:explore`, `/opsx:apply`, `/opsx:update`, `/opsx:sync`, `/opsx:archive` em `.claude/`. `openspec list` / `openspec validate` no terminal.
- Registrar o que funcionou/atrapalhou no processo OpenSpec (é um objetivo do projeto).
- Ideias fora da v1 vão para o backlog em `docs/context.md`, não para a change atual. Avisar quando algo estiver fora do escopo ou for inviável no navegador.
- Sempre pensar na experiência de um iniciante usando o teclado.

### Plano de changes (ordem)
1. `setup-stack` 2. `beat-slots` (+ `beats-imediatos`) 3. `sample-pads` 4. `fx-basicos` (absorveu `keyboard-shortcuts`) 5. `persistencia-minima`
Se o prazo apertar, `persistencia-minima` é cortada.

## Stack

SPA **TypeScript + Vite + React**, áudio com **Tone.js**, banco local **IndexedDB via Dexie**. **Sem backend** (Node/Fastify/SQLite foi descartado). Testes com **Vitest**, só para lógica pura (cálculo de BPM, mapa de teclas). Lint com **oxlint** (veio no template do Vite). Navegador alvo: Chrome/Edge. Poucas dependências.

```bash
npm run dev                                   # servidor Vite
npm run build                                 # tsc -b + vite build
npm test                                      # vitest run
npx vitest run src/input/keymap.test.ts -t "Espaço"   # um teste só
npm run lint                                  # oxlint
```

## Arquitetura

`src/main.tsx` instala o teclado uma única vez (fora do React) e renderiza `ui/App`. `input/` concentra keydown, keyup (efeitos no modo segurar) e blur (solta efeitos segurados).

```
src/
  engine/    Tone.js: relógio, slots de beat, pads, FX — não conhece React; expõe comandos e emite eventos
  commands/  ações nomeadas: switchBeat(n), triggerSample(n), toggleFx(x), stop()...
  input/     teclado e mouse → commands; mapa de teclas e legenda em keymap.ts
  ui/        React; lê estado do engine via useSyncExternalStore
  storage/   repositório Dexie
```

Princípios que atravessam módulos:
- **Motor independente da UI:** estado de áudio fica fora do state do React; rerender nunca pode atrasar o som.
- **Teclado e mouse disparam os mesmos commands** — remapear teclas no futuro deve ser só trocar a tabela tecla→comando.
- **Teclas por `event.code`** (posição física; funciona igual no ABNT2); ignorar `event.repeat`.
- **Tudo na hora, sem quantização:** beats entram, trocam e saem no instante do comando, do início do loop; pads idem. A mesa não alinha decks — o tempo é do DJ. O Transport não roda; só guarda o BPM da mesa (`transport.bpm`).
- **Áudio decodificado ao carregar, não ao tocar.**
- **Trocas no mesmo instante:** use um único `now = Tone.now()` para o `stop` do beat anterior e o `start` do novo, para não haver silêncio nem sobreposição.

Limitações aceitas na v1:
- Sem detecção de BPM: o usuário informa se o loop tem 4 ou 8 compassos; BPM vem da duração.
- Sem time-stretch: o primeiro beat define o BPM; beats com BPM diferente geram aviso.
- Áudio só inicia após gesto do usuário (tela "Pressione Espaço para começar").

Mapa de teclas: `Espaço` tocar/parar, `1`–`8` beats (A: 1–4, B: 5–8), `Q W E R` / `A S D F` pads, `Z`/`X` filtro/eco A, `C`/`V` filtro/eco B, `9`/`0` modo manter/segurar A/B. Fonte única: `KEY_LEGEND` em `src/input/keymap.ts` (um teste garante que cada tecla da legenda tem comando).

Efeitos: cadeia por deck criada em `engine.start()` — players do slot → bus → filtro → saída, e filtro → envio → eco → saída. O eco é um **envio**: desligar fecha a entrada, e o rabo do eco some sozinho. Pads não passam pelos efeitos.

## Restrições da v1

- Sem login/usuário. Persistência mínima só em banco local; cada coisa nova a salvar entra por change própria.
- O usuário carrega os próprios áudios; arquivos de áudio ficam **fora do repositório** (`.gitignore`).
- Não usar marcas de terceiros (Podpah, BASE) no nome ou identidade do produto.
