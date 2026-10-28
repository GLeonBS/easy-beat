# Spec Delta

## Purpose

Permite transformar o som de cada deck ao vivo — abafar com filtro ou repetir com eco — de forma simples pelo teclado, escolhendo se o efeito fica ligado ou só enquanto a tecla é segurada.

## ADDED Requirements

### Requirement: Efeitos por deck
Cada deck SHALL ter um efeito Filtro e um efeito Eco, independentes entre si e do outro deck, mostrados no cabeçalho do deck com sua tecla e se estão ligados. Os efeitos MUST se aplicar a qualquer beat que estiver tocando no deck, inclusive após trocar de beat, e MUST NOT afetar os pads.

#### Scenario: Efeitos visíveis
- **WHEN** o usuário entra na tela da mesa
- **THEN** cada deck mostra os botões Filtro e Eco, desligados, com as teclas Z e X no Deck A e C e V no Deck B

#### Scenario: Efeito acompanha a troca de beat
- **WHEN** o filtro do Deck A está ligado e o usuário troca do slot 1 para o slot 2
- **THEN** o slot 2 já toca com o filtro

#### Scenario: Pads ficam limpos
- **WHEN** o eco do Deck A está ligado e o usuário dispara o pad Q
- **THEN** o pad Q soa sem eco

### Requirement: Filtro
Ligar o filtro de um deck SHALL cortar os agudos do som desse deck, deixando-o "abafado"; desligar MUST devolver o som original. As transições MUST ser suaves, sem estalos.

#### Scenario: Abafar e soltar
- **WHEN** um beat toca no Deck B e o usuário liga e depois desliga o filtro do Deck B
- **THEN** o beat fica abafado enquanto o filtro está ligado e volta ao normal ao desligar

### Requirement: Eco
Ligar o eco de um deck SHALL repetir o som desse deck em intervalos ligados ao BPM da mesa (colcheia pontuada), com repetições que diminuem de volume. Ao desligar, novas repetições MUST parar de ser geradas, e as que já soam MUST terminar naturalmente, sem corte seco.

#### Scenario: Eco no ritmo
- **WHEN** o BPM da mesa é 120 e o usuário liga o eco do Deck A
- **THEN** o som do Deck A se repete a cada 0,375 s, cada vez mais baixo

#### Scenario: Desligar sem corte
- **WHEN** o eco do Deck A está ligado e o usuário o desliga
- **THEN** as repetições já em andamento somem aos poucos

#### Scenario: Mesa sem BPM
- **WHEN** nenhum beat foi carregado e o usuário liga um eco
- **THEN** o eco usa 120 BPM como referência

### Requirement: Modo manter
No modo manter (padrão de cada deck), pressionar a tecla ou clicar no botão de um efeito SHALL alternar entre ligado e desligado; soltar a tecla ou o botão MUST NOT mudar nada.

#### Scenario: Liga e desliga
- **WHEN** o Deck A está no modo manter e o usuário pressiona e solta Z duas vezes
- **THEN** o filtro do Deck A liga na primeira vez e desliga na segunda

### Requirement: Modo segurar
No modo segurar, o efeito SHALL ficar ligado somente enquanto sua tecla ou botão estiver pressionado, desligando ao soltar. Se a janela perder o foco com efeitos segurados, eles MUST desligar.

#### Scenario: Segurar o eco
- **WHEN** o Deck B está no modo segurar e o usuário mantém V pressionado e depois solta
- **THEN** o eco do Deck B fica ligado enquanto V está pressionado e desliga ao soltar

#### Scenario: Janela perde o foco
- **WHEN** o usuário segura C no modo segurar e troca de janela antes de soltar
- **THEN** o filtro do Deck B desliga

### Requirement: Trocar o modo do deck
Cada deck SHALL ter um seletor de modo (manter/segurar), acionado pelo botão do deck ou pelas teclas 9 (Deck A) e 0 (Deck B), mostrando o modo atual. Trocar o modo MUST desligar os efeitos ligados daquele deck.

#### Scenario: Trocar modo com efeito ligado
- **WHEN** o Deck A está no modo manter com o filtro ligado e o usuário pressiona 9
- **THEN** o Deck A passa ao modo segurar, mostrando isso na tela, e o filtro desliga

#### Scenario: Modos independentes
- **WHEN** o usuário pressiona 0
- **THEN** só o modo do Deck B muda

### Requirement: Teclas dos efeitos
As teclas Z, X, C, V, 9 e 0 SHALL ser identificadas pela posição física, e manter uma tecla pressionada MUST NOT repetir a ação.

#### Scenario: Tecla segurada no modo manter
- **WHEN** o Deck A está no modo manter e o usuário mantém X pressionado
- **THEN** o eco do Deck A liga uma única vez e continua ligado ao soltar
