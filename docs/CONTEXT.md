# CONTEXT.md

> Memoria curta da ultima sessao.

## Referencias
- `PRD.md` v2.1 | `Sprints.md`

## Ultima acao
- **Sprint 8 task 13:** `TenantGuard`, header `X-Tenant-Id`, isolamento Prisma em `/v1/users` e M2M `GET /v1/integration/users/:id`, e2e isolamento, `INTEGRATION_GUIDE.md` §5.3.

## Estado
- Sprint 8: tasks 1–13 `done`; tasks 14–17 `pending`.

## Proximo foco
- Task 14 (gateway multi-módulo) ou tasks 15–17 (seeds M2M, demo CTO).

## Credenciais M2M (demo)
- `test-client-id` / `test-client-secret` com escopo `identity:read` no seed.

## Pronto para proxima sessao
1. `npm run prisma:seed` (escopo `identity:read` na app de teste).
2. Testar: token M2M + `GET /v1/integration/users/{uuid}`.
