# Design

## Context

Repositório público `GLeonBS/easy-beat`, branch `main`, Pages ainda não ativado. App 100% estático (Vite → `dist/`), sem rotas e sem backend. `index.html` referencia `/favicon.svg`. `package-lock.json` versionado. Motivação em proposal.md.

## Goals / Non-Goals

**Goals:**
- Publicação automática a cada push na `main`, só se lint e testes passarem.
- O mesmo build funcionando local (`npm run preview`) e no Pages.

**Non-Goals:**
- Ambientes de preview por PR, domínio próprio, cache offline.

## Decisions

**`base: './'` no Vite** em vez de `'/easy-beat/'`: com caminhos relativos o mesmo `dist/` funciona no subcaminho do Pages, em `npm run preview` e se o repositório for renomeado. Vale porque o app é uma página só, sem roteamento. O `/favicon.svg` do `index.html` passa a `./favicon.svg` pelo mesmo motivo.

**Workflow oficial do Pages (`.github/workflows/deploy.yml`):** gatilhos `push` em `main` e `workflow_dispatch`; permissões `contents: read`, `pages: write`, `id-token: write`; `concurrency` do grupo `pages` sem cancelar a publicação em andamento. Job `build`: `actions/checkout@v4`, `actions/setup-node@v4` (Node 22, cache npm), `npm ci`, `npm run lint`, `npm test`, `npm run build`, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3` com `dist`. Job `deploy` (depende de `build`, ambiente `github-pages`): `actions/deploy-pages@v4`. Alternativa descartada: branch `gh-pages` com o pacote `gh-pages` — dependência a mais e build feito na máquina local.

**Ativar o Pages:** `gh api -X POST repos/GLeonBS/easy-beat/pages -f build_type=workflow` (ou, se o Leon preferir, Settings → Pages → Source: GitHub Actions). É mudança de configuração do repositório: só com confirmação explícita.

**Mesa salva por site:** IndexedDB é separado por origem; o que foi salvo em `localhost` não aparece no Pages e vice-versa. O README avisa.

## Risks / Trade-offs

- [Publicar exige push da `main`, que hoje está commits à frente do `origin`] → push só com confirmação do Leon, depois de commitar e arquivar `persistencia-minima`.
- [Versões das actions envelhecem] → aceitável; o workflow é pequeno e fácil de atualizar.
- [Áudio no Safari/Firefox] → navegador alvo segue Chrome/Edge; README diz isso.
