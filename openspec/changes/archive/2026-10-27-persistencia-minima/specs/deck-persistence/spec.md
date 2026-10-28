# Spec Delta

## Purpose

Faz a mesa lembrar os beats e samples carregados entre sessões, para o usuário não precisar escolher os arquivos de novo toda vez que abre o app.

## ADDED Requirements

### Requirement: Salvar áudios carregados
Ao carregar um áudio com sucesso em um slot ou pad, o sistema SHALL salvá-lo no banco local do navegador junto com sua posição, e, para slots, a quantidade de compassos. Mudar os compassos de um slot MUST atualizar o que está salvo. Carregar outro arquivo na mesma posição MUST substituir o salvo.

#### Scenario: Beat salvo
- **WHEN** o usuário carrega um arquivo no slot 3 e escolhe 8 compassos
- **THEN** o arquivo fica salvo como slot 3 com 8 compassos

#### Scenario: Substituir
- **WHEN** o pad W já tinha um sample salvo e o usuário carrega outro arquivo nele
- **THEN** só o novo arquivo fica salvo para o pad W

### Requirement: Restaurar a mesa ao começar
Ao começar a sessão (gesto de início na tela inicial), o sistema SHALL carregar os áudios salvos nas mesmas posições, na ordem em que foram carregados originalmente, para que o BPM da mesa seja o mesmo da sessão anterior. A mesa MUST começar parada, com todos os efeitos desligados.

#### Scenario: Reabrir o app
- **WHEN** na sessão anterior havia beats nos slots 1 e 6 e um sample no pad Q, e o usuário reabre o app e pressiona Espaço
- **THEN** os slots 1 e 6 e o pad Q aparecem carregados como antes, com os mesmos compassos e o mesmo BPM da mesa, e nada está tocando

#### Scenario: Nada salvo
- **WHEN** não há nada salvo e o usuário começa a sessão
- **THEN** a mesa abre vazia, como antes desta mudança

### Requirement: Falhas de salvar ou restaurar
Se um áudio não puder ser salvo, o sistema SHALL avisar em linguagem simples que ele não será lembrado na próxima vez, e o áudio MUST continuar tocável na sessão atual. Se um áudio salvo não puder ser restaurado, a posição MUST ficar vazia, o registro MUST ser descartado e o usuário avisado.

#### Scenario: Banco cheio
- **WHEN** o navegador recusa salvar um arquivo grande
- **THEN** o beat toca normalmente e uma mensagem avisa que ele não será lembrado

#### Scenario: Arquivo salvo corrompido
- **WHEN** um áudio salvo do pad E não pode mais ser lido ao restaurar
- **THEN** o pad E fica vazio, os outros são restaurados e uma mensagem avisa

### Requirement: Limpar mesa
A tela da mesa SHALL ter um botão "Limpar mesa" que pede confirmação. Confirmado, o sistema MUST parar tudo, esvaziar todos os slots e pads, voltar o BPM da mesa para "sem BPM" e apagar o que estava salvo. Cancelado, nada muda.

#### Scenario: Limpar confirmado
- **WHEN** a mesa tem beats e samples, e o usuário clica em "Limpar mesa" e confirma
- **THEN** tudo para, slots e pads ficam vazios, o BPM da mesa some e, ao reabrir o app, a mesa abre vazia

#### Scenario: Limpar cancelado
- **WHEN** o usuário clica em "Limpar mesa" e cancela
- **THEN** a mesa continua exatamente como estava
