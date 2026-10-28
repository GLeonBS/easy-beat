# Spec Delta

## Purpose

Permite carregar loops de beat em slots numerados e trocar entre eles ao vivo, sempre no tempo musical certo, para servir de base contínua a quem está rimando.

## ADDED Requirements

### Requirement: Oito slots de beat
A tela da mesa SHALL exibir 8 slots numerados de 1 a 8, agrupados em Deck A (slots 1–4) e Deck B (slots 5–8). Cada slot MUST mostrar seu número/tecla e seu estado: vazio, pronto, tocando, na fila ou saindo. Slots carregados MUST mostrar também o nome do arquivo, a quantidade de compassos e o BPM calculado.

#### Scenario: Mesa recém-aberta
- **WHEN** o usuário entra na tela da mesa pela primeira vez na sessão
- **THEN** os 8 slots aparecem vazios, cada um com seu número, com os slots 1–4 sob "Deck A" e 5–8 sob "Deck B"

### Requirement: Dois decks simultâneos
Cada deck SHALL tocar no máximo um beat por vez, e os dois decks MUST poder tocar ao mesmo tempo, no mesmo BPM e na mesma grade de compassos. Ações em um deck MUST NOT alterar o que toca no outro.

#### Scenario: Dois sons juntos
- **WHEN** o slot 1 (Deck A) está tocando e o slot 6 (Deck B) entra
- **THEN** os dois beats tocam juntos, alinhados no compasso

#### Scenario: Troca em um deck não afeta o outro
- **WHEN** os slots 1 e 6 estão tocando e o usuário pressiona 2
- **THEN** no próximo compasso o slot 2 substitui o 1, e o slot 6 continua tocando sem interrupção

### Requirement: Carregar beat em um slot
O usuário SHALL poder escolher um arquivo de áudio do computador para qualquer slot e informar se o loop tem 4 ou 8 compassos (padrão: 4). O áudio MUST ser decodificado no carregamento, para tocar sem atraso depois.

#### Scenario: Carregamento com sucesso
- **WHEN** o usuário escolhe um arquivo de áudio válido para o slot 2
- **THEN** o slot 2 passa a "pronto" mostrando nome do arquivo, compassos e BPM

#### Scenario: Arquivo inválido
- **WHEN** o usuário escolhe um arquivo que não pode ser decodificado como áudio
- **THEN** uma mensagem simples informa que o arquivo não pôde ser lido
- **AND** o slot permanece como estava antes

#### Scenario: Substituir beat
- **WHEN** o usuário carrega um novo arquivo em um slot já carregado que não está tocando
- **THEN** o novo arquivo substitui o anterior naquele slot

### Requirement: Carregar vários beats em um deck
Cada deck SHALL ter um botão para escolher vários arquivos de uma vez. Os arquivos MUST preencher os slots vazios daquele deck em ordem, um por vez, sem substituir slots ocupados; arquivos que não couberem são ignorados com aviso.

#### Scenario: Preencher slots vazios
- **WHEN** o slot 2 do Deck A está ocupado e o usuário escolhe 3 arquivos em "Carregar vários" do Deck A
- **THEN** os arquivos vão para os slots 1, 3 e 4, nessa ordem

#### Scenario: Arquivos demais
- **WHEN** o Deck B tem 2 slots vazios e o usuário escolhe 4 arquivos para ele
- **THEN** os 2 primeiros são carregados e uma mensagem informa que 2 arquivos não couberam

#### Scenario: Deck cheio
- **WHEN** todos os slots do deck estão ocupados e o usuário usa "Carregar vários"
- **THEN** nada é carregado e uma mensagem informa que o deck está cheio

### Requirement: BPM calculado pela duração
O BPM de cada beat SHALL ser calculado a partir da duração do arquivo e da quantidade de compassos informada, considerando compasso de 4 tempos. Alterar a quantidade de compassos de um slot MUST recalcular seu BPM.

#### Scenario: Loop de 4 compassos com 8 segundos
- **WHEN** o usuário carrega um loop de 8,0 segundos informando 4 compassos
- **THEN** o BPM mostrado é 120

#### Scenario: Troca de compassos
- **WHEN** o usuário muda esse mesmo slot de 4 para 8 compassos
- **THEN** o BPM mostrado passa a 240

### Requirement: BPM da mesa
O BPM da mesa SHALL ser o BPM do primeiro beat carregado na sessão e MUST ser exibido na tela. Beats cujo BPM difira do BPM da mesa em mais de 2% MUST mostrar um aviso em linguagem simples, mas continuam podendo tocar.

#### Scenario: Primeiro beat define o BPM
- **WHEN** a mesa não tem BPM e o usuário carrega um beat de 90 BPM
- **THEN** o BPM da mesa passa a 90

#### Scenario: Beat com BPM diferente
- **WHEN** o BPM da mesa é 90 e o usuário carrega um beat de 100 BPM
- **THEN** o slot mostra um aviso de que o beat tem velocidade diferente da mesa
- **AND** o beat continua podendo ser tocado

#### Scenario: Beat compatível
- **WHEN** o BPM da mesa é 90 e o usuário carrega um beat de 91 BPM
- **THEN** nenhum aviso é exibido

### Requirement: Tocar e parar
A tecla Espaço e um botão na tela SHALL alternar entre tocar e parar a mesa inteira. Ao tocar a partir do silêncio, o sistema MUST iniciar imediatamente, em cada deck, o beat que estava tocando nele quando a mesa parou; se não houver nenhum, o slot carregado de menor número. Parar MUST silenciar os dois decks na hora.

#### Scenario: Play com beats carregados
- **WHEN** a mesa está parada, os slots 3 e 5 estão carregados e nenhum foi selecionado
- **THEN** ao pressionar Espaço o beat do slot 3 começa a tocar em loop

#### Scenario: Stop
- **WHEN** os slots 1 e 6 estão tocando e o usuário pressiona Espaço
- **THEN** os dois param imediatamente

#### Scenario: Retomar os dois decks
- **WHEN** a mesa parou enquanto os slots 1 e 6 tocavam e o usuário pressiona Espaço de novo
- **THEN** os slots 1 e 6 voltam a tocar juntos, do início

#### Scenario: Play sem beats
- **WHEN** nenhum slot está carregado e o usuário pressiona Espaço
- **THEN** nada toca e a tela mostra a dica "Carregue um beat primeiro"

### Requirement: Selecionar beat com a mesa parada
Com a mesa parada, selecionar um slot carregado (tecla 1–8 ou clique) SHALL começar a tocar esse beat imediatamente, só no deck dele.

#### Scenario: Tecla com a mesa parada
- **WHEN** a mesa está parada e o usuário pressiona 4 com o slot 4 carregado
- **THEN** o beat do slot 4 começa a tocar imediatamente

### Requirement: Entrada de deck no compasso
Com a mesa tocando, selecionar um slot carregado de um deck parado SHALL colocá-lo na fila, e ele MUST começar exatamente no início do próximo compasso, do início do loop.

#### Scenario: Deck B entra
- **WHEN** só o slot 1 está tocando e o usuário pressiona 6 no meio de um compasso
- **THEN** o slot 6 aparece como "na fila" e começa no início do próximo compasso, junto com o slot 1

### Requirement: Troca quantizada no próximo compasso
Com um beat tocando em um deck, selecionar outro slot carregado do mesmo deck SHALL colocá-lo na fila e a troca MUST acontecer exatamente no início do próximo compasso, com o novo beat começando do início. Selecionar outro slot do deck antes da troca MUST substituir o da fila.

#### Scenario: Troca no compasso
- **WHEN** o slot 1 está tocando e o usuário pressiona 2 no meio de um compasso
- **THEN** o slot 2 aparece como "na fila"
- **AND** no início do próximo compasso o slot 1 para e o slot 2 começa, sem sobreposição nem silêncio

#### Scenario: Mudar de ideia antes da troca
- **WHEN** o slot 2 está na fila e o usuário pressiona 3 antes do próximo compasso
- **THEN** o slot 3 substitui o 2 na fila e é ele que entra no próximo compasso

### Requirement: Tirar um deck no compasso
Selecionar o slot que está tocando SHALL cancelar a fila do deck dele, se houver; sem fila, MUST tirar esse deck no início do próximo compasso. Se nenhum deck continuar tocando, a mesa para.

#### Scenario: Cancelar fila
- **WHEN** o slot 1 está tocando, o slot 2 está na fila e o usuário pressiona 1
- **THEN** a fila é cancelada e o slot 1 continua tocando

#### Scenario: Tirar uma camada
- **WHEN** os slots 1 e 6 estão tocando e o usuário pressiona 6
- **THEN** o slot 6 aparece como "saindo" e para no início do próximo compasso, e o slot 1 continua

#### Scenario: Tirar o último deck
- **WHEN** só o slot 1 está tocando e o usuário pressiona 1
- **THEN** no início do próximo compasso o slot 1 para e a mesa fica parada

### Requirement: Slot vazio não toca
Selecionar um slot vazio SHALL NOT alterar o que está tocando e MUST mostrar a dica de que o slot está vazio.

#### Scenario: Tecla de slot vazio
- **WHEN** o slot 1 está tocando e o usuário pressiona 7 com o slot 7 vazio
- **THEN** o slot 1 continua tocando e a tela indica que o slot 7 está vazio

### Requirement: Teclas dos slots
As teclas 1 a 8 da fila de números e do teclado numérico SHALL selecionar os slots correspondentes, identificadas pela posição física, e manter uma tecla pressionada MUST NOT repetir a ação.

#### Scenario: Teclado numérico
- **WHEN** o usuário pressiona 5 no teclado numérico
- **THEN** o efeito é o mesmo de pressionar 5 na fila de números

#### Scenario: Tecla segurada
- **WHEN** o usuário mantém a tecla 2 pressionada
- **THEN** a seleção do slot 2 acontece uma única vez
