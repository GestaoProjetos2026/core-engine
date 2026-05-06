# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 5: concluída Task 7 — `Helmet e CSP por ambiente (P1 PRD §20)`. Adicionado e configurado `@fastify/helmet` no NestJS (`FastifyAdapter`) com CSP condicional à variável de ambiente para não quebrar o Swagger UI fora de produção.

## Arquivos modificados recentemente
- `src/server/health/health.service.ts` e `src/server/health/health.service.spec.ts` — Nova service monitorando Prisma e Redis.
- `src/server/health/health.module.ts` — Importado `PrismaModule`.
- `src/server/health/health.controller.ts` e `src/server/health/health.controller.spec.ts` — Rota atualizada, integrando DI com decorador `@Inject`.
- `docs/CONTEXT.md` e `docs/PRD_DEVELOPMENT.md` — Tracking de progresso da sprint.

## Estado atual
- Sprint 5 em andamento. Tasks 1, 2, 3, 4 e 7 concluídas.
- Carga de observabilidade e segurança de cabeçalhos HTTP adicionadas e configuradas com sucesso.

## Pendencias e debitos
- Próximas tasks da Sprint 5: Pipeline CI (Task 5), Cobertura em módulos críticos (Task 6).

## Riscos e atencoes
- O esbuild (tsx de reload auto) apresenta gargalos de extração de metadados das classes no construtor de classes intermódulos. Os decorators `@Inject(X)` devem ser explícitos e manutenidos para qualquer injeção no constructor na pipeline atual de desenvolvimento para compilação ilesa a instabilidades.

## Proximo foco
- Sprint 5 - Task 5: Pipeline CI: lint, testes, build (DoD). Adicionar GitHub Actions para o repositório rodar o pipeline automático antes de cada integração de PR.

## Tasks concluidas na sessao
- Sprint 5 - Task 7: Helmet e CSP por ambiente (P1 PRD §20).

## Observacoes uteis para a proxima sessao
- O teste do `HealthService` foi contruído de forma a não depender da daemon real do PostgreSQL ou do Redis. Isso garante a flexibilidade exigida numa pipeline de CI que será implementada na Task 5.
