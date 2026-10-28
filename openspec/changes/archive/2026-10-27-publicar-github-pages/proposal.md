# Proposal

## Why

A mesa só roda com `npm run dev` na máquina do Leon. Publicar no GitHub Pages permite abrir o EasyBeat por um link, em qualquer computador com Chrome/Edge, sem instalar nada — e mostrar o projeto. Era item do backlog ("Deploy público / hospedagem"); o Leon decidiu trazê-lo para a v1 como última fase.

## What Changes

- Build com caminhos relativos (`base: './'` no Vite), para o app funcionar em `https://gleonbs.github.io/easy-beat/`.
- Workflow do GitHub Actions que, a cada push na `main` (ou manualmente), roda lint, testes e build e publica `dist/` no GitHub Pages. Se lint ou testes falharem, nada é publicado.
- Ativar o GitHub Pages do repositório com origem "GitHub Actions".
- README com o link, o que é o app, como usar e como rodar localmente.
- `docs/context.md`: "Deploy público / hospedagem" sai do backlog e entra na v1.

**Sem mudança de comportamento do app** — a change marca `skip_specs: true`. Nenhum áudio é publicado: arquivos de áudio continuam fora do repositório, então a restrição de não distribuir conteúdo de terceiros segue atendida.

Fora desta change: domínio próprio, PWA/offline, conteúdo embutido.

## Capabilities

### New Capabilities
<!-- Nenhuma: publicação é infraestrutura (skip_specs). -->

### Modified Capabilities
<!-- Nenhuma. -->

## Impact

- Novos: `.github/workflows/deploy.yml`.
- Alterados: `vite.config.ts`, `README.md`, `docs/context.md`, `CLAUDE.md`.
- Configuração do repositório no GitHub (Pages via Actions) — ação externa, feita com a confirmação do Leon.
