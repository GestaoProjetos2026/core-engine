# CONTEXT.md

> Memoria curta da ultima sessao.

## Referencias
- `PRD.md` v2.1 | `Sprints.md`

## Ultima acao
- **Sprint 8 task 11:** `GET /v1/integration/users/:id` (M2M + `identity:read`), `IntegrationTokenGuard`, seed, e2e, `INTEGRATION_GUIDE.md`.

## Estado
- Sprint 8: tasks 1–11 `done`; tasks 12–17 `pending`.

## Proximo foco
- Tasks 12–13 (multi-tenant) ou task 14 (gateway).

## Credenciais M2M (demo)
- `test-client-id` / `test-client-secret` com escopo `identity:read` no seed.

## Pronto para proxima sessao
1. `npm run prisma:seed` (escopo `identity:read` na app de teste).
2. Testar: token M2M + `GET /v1/integration/users/{uuid}`.
