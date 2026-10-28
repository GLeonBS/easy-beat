# sample-pads Specification

## Purpose
Permite soltar sons curtos por cima dos beats, na hora, com uma tecla, para dar vida à base enquanto alguém rima.

## Requirements

### Requirement: Oito pads
A tela da mesa SHALL exibir uma seção "Pads" com 8 pads, nas teclas Q, W, E, R (primeira linha) e A, S, D, F (segunda linha). Cada pad MUST mostrar sua tecla, o nome do arquivo (ou que está vazio) e se está tocando.

#### Scenario: Pads recém-abertos
- **WHEN** o usuário entra na tela da mesa pela primeira vez na sessão
- **THEN** os 8 pads aparecem vazios, cada um com sua letra

### Requirement: Carregar sample em um pad
O usuário SHALL poder escolher um arquivo de áudio do computador para qualquer pad. O áudio MUST ser decodificado no carregamento, para tocar sem atraso depois. Um arquivo que não pode ser decodificado MUST gerar uma mensagem simples e deixar o pad como estava.

#### Scenario: Carregamento com sucesso
- **WHEN** o usuário escolhe um arquivo de áudio válido para o pad W
- **THEN** o pad W passa a mostrar o nome do arquivo e fica pronto para tocar

#### Scenario: Arquivo inválido
- **WHEN** o usuário escolhe para um pad um arquivo que não é áudio
- **THEN** uma mensagem informa que o arquivo não pôde ser lido e o pad permanece como estava

### Requirement: Carregar vários samples
A seção de pads SHALL ter um botão para escolher vários arquivos de uma vez. Os arquivos MUST preencher os pads vazios em ordem (Q, W, E, R, A, S, D, F), sem substituir pads ocupados; arquivos que não couberem são ignorados com aviso.

#### Scenario: Preencher pads vazios
- **WHEN** o pad Q está ocupado e o usuário escolhe 2 arquivos em "Carregar vários" dos pads
- **THEN** os arquivos vão para os pads W e E, nessa ordem

#### Scenario: Pads cheios
- **WHEN** todos os pads estão ocupados e o usuário usa "Carregar vários" dos pads
- **THEN** nada é carregado e uma mensagem informa que os pads estão cheios

### Requirement: Disparar pad na hora
Pressionar a tecla de um pad carregado ou clicar nele SHALL tocar o sample imediatamente, do início ao fim, uma vez, sem esperar o tempo musical. Isso MUST funcionar com a mesa tocando ou parada e MUST NOT alterar o que os decks estão tocando.

#### Scenario: Pad com beat tocando
- **WHEN** um beat está tocando e o usuário pressiona A com o pad A carregado
- **THEN** o sample do pad A soa na hora, por cima do beat, e o beat continua

#### Scenario: Pad com a mesa parada
- **WHEN** a mesa está parada e o usuário clica no pad E carregado
- **THEN** o sample do pad E soa na hora e a mesa continua parada

### Requirement: Repetir pad reinicia
Disparar um pad cujo sample ainda está tocando SHALL interromper esse som e tocá-lo de novo do início. Pads diferentes MUST poder soar ao mesmo tempo.

#### Scenario: Picotar um sample
- **WHEN** o sample do pad Q está tocando e o usuário pressiona Q de novo
- **THEN** o som do pad Q recomeça do início, sem duas cópias soando juntas

#### Scenario: Dois pads juntos
- **WHEN** o sample do pad Q está tocando e o usuário pressiona W
- **THEN** os samples de Q e W soam juntos

### Requirement: Pad vazio
Disparar um pad vazio SHALL NOT tocar nada nem alterar o que está tocando, e MUST mostrar a dica de que o pad está vazio.

#### Scenario: Tecla de pad vazio
- **WHEN** o usuário pressiona F com o pad F vazio
- **THEN** nada toca e a tela indica que o pad F está vazio

### Requirement: Parar a mesa corta os pads
Quando o usuário para a mesa (Espaço ou botão de parar), os samples de pad que estiverem tocando SHALL parar na hora junto com os decks.

#### Scenario: Stop corta tudo
- **WHEN** um beat e o sample do pad S estão tocando e o usuário pressiona Espaço
- **THEN** o beat e o sample param imediatamente

### Requirement: Teclas dos pads
As teclas dos pads SHALL ser identificadas pela posição física (igual em qualquer layout, ex.: ABNT2), e manter uma tecla pressionada MUST NOT repetir o disparo.

#### Scenario: Tecla segurada
- **WHEN** o usuário mantém a tecla D pressionada
- **THEN** o sample do pad D é disparado uma única vez
