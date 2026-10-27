# audio-start Specification

## Purpose
Garante que o áudio da mesa só seja liberado depois de um gesto explícito do usuário, como o navegador exige, com uma tela inicial clara para iniciantes.

## Requirements

### Requirement: Tela inicial antes do áudio
Ao abrir o app, o sistema SHALL exibir uma tela inicial com a instrução "Pressione Espaço para começar" e MUST NOT produzir som nem iniciar o relógio musical enquanto o usuário não fizer o gesto de início.

#### Scenario: App recém-aberto
- **WHEN** o usuário abre o app no navegador
- **THEN** a tela inicial é exibida com a instrução "Pressione Espaço para começar"
- **AND** nenhum áudio é reproduzido

### Requirement: Início pelo teclado
O sistema SHALL liberar o áudio quando o usuário pressionar a tecla Espaço na tela inicial, identificando a tecla pela posição física (independente do layout, ex.: ABNT2).

#### Scenario: Espaço inicia
- **WHEN** a tela inicial está visível e o usuário pressiona Espaço
- **THEN** o áudio é liberado e a tela inicial é substituída pela tela da mesa

#### Scenario: Tecla segurada não repete
- **WHEN** o usuário mantém Espaço pressionado
- **THEN** o início acontece uma única vez, sem disparos repetidos

### Requirement: Início pelo mouse
O sistema SHALL oferecer na tela inicial um botão que produz o mesmo efeito da tecla Espaço.

#### Scenario: Clique inicia
- **WHEN** a tela inicial está visível e o usuário clica no botão de começar
- **THEN** o áudio é liberado e a tela da mesa é exibida, igual ao início por Espaço

### Requirement: Falha ao liberar o áudio
Se o navegador recusar a liberação do áudio, o sistema SHALL permanecer na tela inicial e mostrar uma mensagem simples pedindo para tentar de novo.

#### Scenario: Navegador recusa
- **WHEN** o usuário faz o gesto de início e a liberação do áudio falha
- **THEN** a tela inicial continua visível com uma mensagem de erro em linguagem simples
- **AND** um novo gesto de início tenta liberar o áudio outra vez
