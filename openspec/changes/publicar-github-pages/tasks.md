# Tasks

## 1. Build e workflow

- [x] 1.1 Configurar `base: './'` no `vite.config.ts` e trocar o favicon do `index.html` para `./favicon.svg`; verificar com `npm run build` e conferir em `dist/index.html` que os assets usam `./assets/...`
- [x] 1.2 Criar `.github/workflows/deploy.yml` (push na `main` + manual; lint, testes, build, upload e deploy do Pages); verificar a sintaxe do YAML e que os comandos do job rodam localmente (`npm ci`, `npm run lint`, `npm test`, `npm run build`)

## 2. Docs

- [x] 2.1 Escrever o `README.md` (o que é, link do Pages, teclas principais, navegador alvo, áudios do usuário, mesa salva por site, como rodar localmente); verificar que os comandos citados existem no `package.json`
- [x] 2.2 Mover "Deploy público / hospedagem" do backlog para a v1 em `docs/context.md` e registrar no `CLAUDE.md` o deploy (workflow, URL, `base: './'`); verificar que o texto bate com os arquivos

## 3. Publicação (ações externas, com confirmação do Leon)

- [x] 3.1 Ativar o GitHub Pages com origem GitHub Actions; verificar com `gh api repos/GLeonBS/easy-beat/pages` retornando `build_type: workflow`
- [ ] 3.2 Fazer push da `main` e acompanhar o workflow até concluir; verificar que `https://gleonbs.github.io/easy-beat/` abre a tela "Pressione Espaço para começar"

## Workflow follow-up

- Leon abre o link no Chrome e testa a mesa com seus áudios.
- Arquivar a change (`/opsx:archive`); com `skip_specs`, nenhuma spec é alterada.
