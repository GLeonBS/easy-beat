# key-legend Specification

## Purpose
Mostra na tela da mesa quais teclas fazem o quê, para o iniciante usar o teclado sem precisar decorar os atalhos.

## Requirements

### Requirement: Legenda de teclas
A tela da mesa SHALL exibir, sempre visível, uma legenda com todas as teclas e suas ações: Espaço (tocar/parar), 1–8 (beats), Q W E R / A S D F (pads), Z/X e C/V (filtro/eco dos decks A e B), 9/0 (modo dos decks A e B).

#### Scenario: Legenda na mesa
- **WHEN** o usuário está na tela da mesa
- **THEN** a legenda com todas as teclas está visível sem precisar rolar até ela ou abrir algo

#### Scenario: Legenda e teclas coerentes
- **WHEN** a legenda indica uma tecla para uma ação
- **THEN** pressionar essa tecla executa exatamente essa ação
