# Contexto — EasyBeat
 
## O que é
Mesa de DJ no navegador para iniciantes que querem aprender música.
 
Inspiração: o estilo de performance do DJ Mu540 no programa BASE — beats contínuos trocados ao vivo no tempo certo, com samples e efeitos por cima, servindo de base para MCs rimarem. Não é só mixagem clássica de músicas inteiras.
 
## Natureza do projeto
- Projeto pequeno, feito para ser rápido.
- Serve principalmente como **teste do OpenSpec** (SDD) — sem muita complexidade envolvida.
- Uso pessoal e local: por enquanto, só o Leon usa, para experimentar.
- Na dúvida entre fazer mais ou entregar no prazo, corta-se escopo.
## Meta atual: v1 funcional até quinta-feira, 29/10/2026
 
### Dentro da v1
- A mesa de DJ funcionando: tocar beats, trocar no tempo certo, soltar samples/efeitos por cima.
- Roda **localmente**: app + banco local, subidos na máquina e usados no navegador local.
- **Sem login e sem usuário.**
- **Persistência mínima em banco local:** só registros essenciais. O que exatamente será salvo é definido em change própria.
- O usuário carrega os próprios arquivos de áudio.
- Ações principais acessíveis pelo teclado com atalhos padrão; o mouse também funciona.
### Fora da v1 (backlog)
- Login, contas, perfis de usuário.
- Persistência além do mínimo essencial.
- Deploy público / hospedagem.
- Mapeamento de teclas personalizável (candidato — já seria possível salvar no banco local).
- Proteção de atalhos do navegador/sistema (Fullscreen + Keyboard Lock API).
- Modo aprendizado (contagem de tempos e compassos, dicas contextuais).
- Conteúdo embutido (beats/samples livres de direitos).
## Princípios do produto (direção de longo prazo)
- **Público iniciante:** linguagem simples, interface didática.
- **Teclado em primeiro lugar:** toda ação possível pelo teclado; mouse continua funcionando.
- **O som nunca "atravessa":** trocas de beat e entradas de sample acontecem no tempo musical certo.
- **Modo aprendizado** (futuro): ensinar a contar tempos e compassos (4/8/16), achar o "1" e saber quando trocar o beat ou soltar um efeito.
- **Proteção de atalhos** (futuro, com degradação elegante): atalhos comuns podem ser interceptados em qualquer navegador; Ctrl+W/Ctrl+T/Esc só com Fullscreen + Keyboard Lock API (Chrome/Edge); combinações do sistema (Ctrl+Alt+Del etc.) nunca. Sempre informar ao usuário o que está e o que não está protegido.
## Restrições
- Áudios: enquanto o uso for pessoal e local, pode-se usar qualquer beat ou sample. Os arquivos de áudio ficam fora do repositório (ex.: `.gitignore`). Se um dia o projeto for publicado ou distribuído, rever isso: não embutir conteúdo de terceiros sem licença.
- Não usar marcas de terceiros (Podpah, BASE) no nome ou na identidade do produto.