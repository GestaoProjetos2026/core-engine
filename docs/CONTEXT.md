# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Estrutura inicial de suporte para desenvolvimento assistido por IA criada (`docs/` e `prompts/`).

## Arquivos modificados recentemente
- `docs/CONTEXT.md`
- `docs/AI_WORKFLOW.md`
- `docs/SESSION_CHECKLIST.md`
- `prompts/bootstrap.txt`
- `prompts/close-session.txt`
- `prompts/reverse-engineering.txt`
- `prompts/next-task.txt`

## Estado atual
- Repositorio com fundacao documental para sessoes com IA pronta para uso.
- `PRD.md` definido como referencia normativa ativa do produto.
- `Sprints.md` definido como referencia de execucao (backlog e prioridade).
- Projeto atual focado em base backend TypeScript com Fastify + Prisma + PostgreSQL + Redis.
- Estrutura de codigo funcional ainda enxuta (sem `src/` consolidado no estado atual).

## Pendencias e debitos
- Iniciar proxima sessao com `prompts/bootstrap.txt`.
- Validar no inicio da sessao qual item ativo do `Sprints.md` sera executado.
- Manter este arquivo atualizado ao final de cada sessao para evitar perda de contexto.

## Riscos e atencoes
- Risco de desalinhamento entre o que esta no `README.md` e o que esta realmente implementado no codigo.
- Risco de a IA iniciar codificacao sem confirmar impacto tecnico e item de sprint alvo.
- Risco de decisoes ficarem apenas no chat se o handoff nao for registrado aqui.

## Proximo foco
- Selecionar o proximo item logico do `Sprints.md` e abrir sessao com bootstrap.
- Antes de codar, confirmar impacto tecnico com base em estrutura atual + PRD.

## Observacoes uteis para a proxima sessao
- Sempre tratar `PRD.md` como contrato de produto e regras.
- Sempre tratar `Sprints.md` como contrato de execucao e prioridade.
- Se houver divergencia entre PRD e implementacao atual, registrar gap antes de propor alteracoes.
- Usar erros/logs reais do terminal e testes como insumo de prompt para depuracao e refinamento.

## Template de atualizacao rapida (copiar e preencher)
```md
## Ultima acao realizada
- ...

## Arquivos modificados recentemente
- ...

## Estado atual
- ...

## Pendencias e debitos
- ...

## Riscos e atencoes
- ...

## Proximo foco
- ...

## Observacoes uteis para a proxima sessao
- ...
```
