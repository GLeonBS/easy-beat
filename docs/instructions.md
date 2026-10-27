# Instruções — como trabalhar no EasyBeat

## Papel deste projeto do Claude
- Aqui se pensa, discute e revisa: ideias, specs, changes e decisões.
- A implementação acontece no repositório, não aqui.

## Metodologia: SDD com OpenSpec (obrigatório)
- Nenhuma implementação sem change/spec aprovada.
- Fluxo: propor a change (proposal + tasks + deltas de spec) → revisar e aprovar → implementar → arquivar a change, atualizando as specs.
- Changes pequenas e focadas: uma capacidade por change sempre que possível.
- Como o objetivo também é testar o OpenSpec, vale registrar o que funcionou e o que atrapalhou no processo.

## Regras para a v1 (até 29/10/2026)
- Manter simples: poucas dependências; roda localmente (app + banco local), sem serviços além do necessário.
- Nada de login ou usuário.
- Persistência só em banco local e só para o mínimo essencial; cada coisa nova a salvar entra por change própria.
- Ideias novas fora do escopo da v1 entram no backlog (ver `context.md`), não na change atual.
- Diante de risco de prazo, cortar escopo antes de estender a data.

## Como me ajudar
- Responder em português.
- Pensar sempre na experiência de um iniciante usando o teclado.
- Apontar quando uma ideia for tecnicamente inviável no navegador.
- Avisar quando algo proposto estiver fora do escopo da v1.
- Respostas diretas e curtas; detalhar só quando pedido.