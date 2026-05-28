# CONTEXT.md

> Memoria curta da ultima sessao.

## Referencias
- `PRD.md` v2.1 | `Sprints.md`

## Ultima acao
- **Sprint 8 task 15:** apps M2M `finance-fiscal`, `crm-leads`, `service-desk` + escopos no seed; `PERMISSIONS_MATRIX.md` §3.

## Estado
- Sprint 8: tasks 1–15 `done`; tasks 16–17 `pending`.

## Proximo foco
- Tasks 16–17 (`DEMO_CTO.md`, demo CTO 29/05).

## Gateway local
- Entrada: `http://localhost` — Core `/v1/health`, módulo `/v1/crm/health`; smoke: `scripts/gateway-smoke.sh`

## Credenciais M2M (demo)
| client_id | secret | escopos principais |
|-----------|--------|-------------------|
| `finance-fiscal` | `FinanceFiscal-Demo2026!` | `identity:read`, `finance:read` |
| `crm-leads` | `CrmLeads-Demo2026!` | `identity:read`, `customers:read` |
| `service-desk` | `ServiceDesk-Demo2026!` | `identity:read`, `tickets:read` |
| `test-client-id` | `test-client-secret` | e2e / QA |

## Pronto para proxima sessao
1. `npm run prisma:seed` (escopo `identity:read` na app de teste).
2. Testar: token M2M + `GET /v1/integration/users/{uuid}`.
