# Spec Delta

## MODIFIED Requirements

### Requirement: Oito slots de beat
A tela da mesa SHALL exibir 8 slots numerados de 1 a 8, agrupados em Deck A (slots 1–4) e Deck B (slots 5–8). Cada slot MUST mostrar seu número/tecla e seu estado: vazio, pronto ou tocando. Slots carregados MUST mostrar também o nome do arquivo, a quantidade de compassos e o BPM calculado.

#### Scenario: Mesa recém-aberta
- **WHEN** o usuário entra na tela da mesa pela primeira vez na sessão
- **THEN** os 8 slots aparecem vazios, cada um com seu número, com os slots 1–4 sob "Deck A" e 5–8 sob "Deck B"

### Requirement: Dois decks simultâneos
Cada deck SHALL tocar no máximo um beat por vez, e os dois decks MUST poder tocar ao mesmo tempo. A mesa MUST NOT ajustar o alinhamento entre os decks: o tempo entre eles é definido pelo momento em que o usuário dispara cada um. Ações em um deck MUST NOT alterar o que toca no outro.

#### Scenario: Dois sons juntos
- **WHEN** o slot 1 (Deck A) está tocando e o slot 6 (Deck B) entra
- **THEN** os dois beats tocam juntos

#### Scenario: Troca em um deck não afeta o outro
- **WHEN** os slots 1 e 6 estão tocando e o usuário pressiona 2
- **THEN** o slot 2 substitui o 1 na hora, e o slot 6 continua tocando sem interrupção

## ADDED Requirements

### Requirement: Entrada na hora
Com a mesa tocando, selecionar um slot carregado de um deck parado SHALL fazê-lo começar imediatamente, do início do loop.

#### Scenario: Deck B entra no meio do compasso
- **WHEN** o slot 1 está tocando e o usuário pressiona 6 no meio de um compasso
- **THEN** o slot 6 começa naquele instante, do início do loop, junto com o slot 1

### Requirement: Troca na hora
Com um beat tocando em um deck, selecionar outro slot carregado do mesmo deck SHALL trocar imediatamente: o beat anterior para e o novo começa do início do loop no mesmo instante, sem silêncio nem sobreposição.

#### Scenario: Troca no meio do compasso
- **WHEN** o slot 1 está tocando e o usuário pressiona 2 no meio de um compasso
- **THEN** no mesmo instante o slot 1 para e o slot 2 começa do início

### Requirement: Tirar um deck na hora
Selecionar o slot que está tocando SHALL parar esse deck imediatamente. Se nenhum deck continuar tocando, a mesa para, sem cortar os pads.

#### Scenario: Tirar uma camada
- **WHEN** os slots 1 e 6 estão tocando e o usuário pressiona 6
- **THEN** o slot 6 para na hora e o slot 1 continua

#### Scenario: Tirar o último deck
- **WHEN** só o slot 1 está tocando, o pad Q está tocando e o usuário pressiona 1
- **THEN** o slot 1 para na hora, a mesa fica parada e o pad Q continua

## REMOVED Requirements

### Requirement: Entrada de deck no compasso
**Reason**: O usuário quer controlar o tempo no ouvido; esperar o compasso deixava a resposta lenta.
**Migration**: Ver "Entrada na hora".

### Requirement: Troca quantizada no próximo compasso
**Reason**: A troca passa a acontecer no instante da seleção; não há mais fila.
**Migration**: Ver "Troca na hora".

### Requirement: Tirar um deck no compasso
**Reason**: Sem fila, não há o que cancelar; o deck sai na hora.
**Migration**: Ver "Tirar um deck na hora".
