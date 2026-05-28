# CONTEXT.md

> Memoria curta da ultima sessao.

## Referencias
- `PRD.md` v2.1 | `Sprints.md`

## Ultima acao
- **Sprint 8 task 14:** `frontend/nginx.conf.template`, stubs `infra/mock-modules`, compose `module-stubs`, `docs/GATEWAY.md`, `scripts/gateway-smoke.sh`.

## Estado
- Sprint 8: tasks 1–14 `done`; tasks 15–17 `pending`.

## Proximo foco
- Tasks 15–17 (seeds M2M por squad, `DEMO_CTO.md`, demo 29/05).

## Gateway local
- Entrada: `http://localhost` — Core `/v1/health`, módulo `/v1/crm/health`; smoke: `scripts/gateway-smoke.sh`

## Credenciais M2M (demo)
- `test-client-id` / `test-client-secret` com escopo `identity:read` no seed.

## Pronto para proxima sessao
1. `npm run prisma:seed` (escopo `identity:read` na app de teste).
2. Testar: token M2M + `GET /v1/integration/users/{uuid}`.
