# easy-beat

Mesa de DJ no navegador para iniciantes: beats em loop em dois decks, trocados ao vivo, com samples e efeitos por cima — uma base para quem quer rimar ou aprender a mixar no tempo, no ouvido.

**Abrir:** https://gleonbs.github.io/easy-beat/ (Chrome ou Edge)

## Como usar

1. Pressione **Espaço** para começar (o navegador só libera o áudio depois de um gesto).
2. Carregue seus próprios arquivos de áudio nos slots de beat (Deck A: 1–4, Deck B: 5–8) e nos pads. O app não vem com áudios.
3. Em cada beat, informe se o loop tem 4 ou 8 compassos — o BPM é calculado pela duração, então use loops cortados certinho.

| Tecla | Ação |
|---|---|
| `Espaço` | tocar / parar |
| `1`–`8` | beats (entram, trocam e saem na hora) |
| `Q W E R` / `A S D F` | pads |
| `Z` / `X` | filtro / eco do Deck A |
| `C` / `V` | filtro / eco do Deck B |
| `9` / `0` | modo manter/segurar dos efeitos dos decks A / B |

A legenda completa também aparece no rodapé da mesa.

A mesa é salva no próprio navegador (IndexedDB) e volta montada na próxima vez. O que fica salvo é separado por site: o que você carregou rodando localmente não aparece na versão publicada, e vice-versa. **Limpar mesa** apaga tudo.

## Rodar localmente

Requer Node 20.19+.

```bash
npm install
npm run dev
```

Outros comandos: `npm run build`, `npm test`, `npm run lint`.

O projeto é desenvolvido com SDD usando [OpenSpec](https://github.com/Fission-AI/OpenSpec): as specs ficam em `openspec/specs/` e o histórico de mudanças em `openspec/changes/archive/`. A publicação no GitHub Pages é automática a cada push na `main`.
