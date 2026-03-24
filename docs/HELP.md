# HELP.md

## Como iniciar uma sessao (ex.: Sprint 2)

Use este guia como fluxo padrao para trabalhar com IA no projeto.

## Resumo rapido
- Inicio de sessao: `prompts/bootstrap.txt`
- Retomada curta (opcional): `prompts/next-task.txt`
- Fechamento obrigatorio: `prompts/close-session.txt`

## Fluxo oficial (recomendado)

1) **Abrir sessao com bootstrap**
- Rode `prompts/bootstrap.txt`.
- A IA deve:
  - ler `PRD.md` (fonte normativa);
  - ler `Sprints.md` (fonte oficial de backlog);
  - ler `docs/CONTEXT.md` (handoff da ultima sessao);
  - analisar estrutura real do repositorio;
  - propor item alvo da sprint e impacto tecnico;
  - **parar e aguardar confirmacao antes de codar**.

2) **Confirmar item da sprint e executar**
- Voce confirma o item (ex.: Sprint 2, item 1).
- A IA implementa somente o combinado.
- Durante a sessao, mantenha foco no item do `Sprints.md`.

3) **Encerrar sessao com close-session**
- Rode `prompts/close-session.txt`.
- A IA deve:
  - resumir o que foi feito;
  - listar arquivos alterados;
  - registrar pendencias e riscos;
  - sugerir proximo item logico do `Sprints.md`;
  - atualizar `docs/CONTEXT.md` com handoff completo.

## Onde entra o next-task

`prompts/next-task.txt` e um atalho para retomar rapidamente.

Use quando:
- a fundacao documental ja esta organizada;
- `docs/CONTEXT.md` esta atualizado;
- voce quer ir direto ao proximo item.

Nao use como unica abertura se:
- houve pausa longa;
- contexto mudou bastante;
- existe duvida sobre prioridade/escopo.

Nesses casos, prefira `bootstrap.txt`.

## Sequencias prontas

### Sequencia mais segura (padrao)
1. `prompts/bootstrap.txt`
2. Execucao da tarefa da sprint
3. `prompts/close-session.txt`

### Sequencia rapida de continuidade
1. `prompts/next-task.txt`
2. Execucao da tarefa da sprint
3. `prompts/close-session.txt`

## Exemplo pratico para Sprint 2

1. Inicie com `prompts/bootstrap.txt`.
2. A IA le `PRD.md`, `Sprints.md`, `docs/CONTEXT.md` e mapeia impacto tecnico.
3. A IA propoe item alvo (ex.: "Sprint 2 - Bootstrap NestJS e modulo Health").
4. Voce confirma.
5. A IA executa.
6. No final, rode `prompts/close-session.txt`.
7. Verifique se `docs/CONTEXT.md` foi atualizado com:
   - estado atual;
   - pendencias;
   - riscos;
   - proximo foco.

## Regras de ouro
- `PRD.md` = fonte normativa de visao, escopo, arquitetura e regras.
- `Sprints.md` = fonte oficial de backlog, execucao e priorizacao.
- Nao inventar backlog.
- Nao mover item de sprint sem decisao explicita.
- Nao encerrar sessao sem atualizar `docs/CONTEXT.md`.
