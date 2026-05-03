# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 5: concluída Task 2 — `Logs estruturados JSON com requestId (RNF11)`. Implementada geração automática de `requestId` pelo Fastify, integração com `nestjs-pino` para logs estruturados e propagação do ID no campo `meta` dos envelopes de resposta (sucesso e erro).

## Arquivos modificados recentemente
- `src/main.ts` — Configuração do Fastify para `requestId` e Logger global pino.
- `src/server/app.module.ts` — Registro do `LoggerModule`.
- `src/server/common/response-envelope.interceptor.ts` — Inclusão de `meta.requestId`.
- `src/server/common/api-exception.filter.ts` — Inclusão de `meta.requestId`.
- `docs/PRD_DEVELOPMENT.md` — Histórico atualizado.

## Estado atual
- Sprint 5 em andamento. Tasks 1 (Rate Limit) e 2 (Logs/RequestId) concluídas.
- Observabilidade aprimorada com logs JSON correlacionáveis.

## Pendencias e debitos
- Próximas tasks da Sprint 5: Auditoria (Task 3).

## Riscos e atencoes
- O formato de log em produção agora é JSON puro. Ferramentas de coleta devem estar configuradas para tal.
- Em desenvolvimento, o log é formatado via `pino-pretty`.

## Proximo foco
- Sprint 5 - Task 3: Auditoria básica para eventos críticos (Login, Refresh, etc.).

## Tasks concluidas na sessao
- Sprint 5 - Task 1: Rate limit e lockout (RNF07).
- Sprint 5 - Task 2: Logs estruturados JSON com requestId (RNF11).

## Observacoes uteis para a proxima sessao
- O `requestId` é gerado via `crypto.randomUUID()` no `main.ts`.
- O interceptor e o filtro de exceção extraem o ID de `req.id` (padrão Fastify).
