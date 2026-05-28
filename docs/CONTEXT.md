# CONTEXT.md

> Memoria curta da ultima sessao.

## Referencias
- `PRD.md` v2.1 | `Sprints.md`

## Ultima acao
- **Sprint 8 task 12:** modelo `Tenant`, migração Prisma, claim `tenant_id` no JWT (`user_access`), `GET /v1/auth/me` com `tenantId`, seed tenant default, `JWT_GUIDE.md`.

## Estado
- Sprint 8: tasks 1–12 `done`; tasks 13–17 `pending`.

## Proximo foco
- Task 13 (`X-Tenant-Id` + isolamento de consultas) ou task 14 (gateway).

## Credenciais M2M (demo)
- `test-client-id` / `test-client-secret` com escopo `identity:read` no seed.

## Pronto para proxima sessao
1. `npm run prisma:seed` (escopo `identity:read` na app de teste).
2. Testar: token M2M + `GET /v1/integration/users/{uuid}`.
