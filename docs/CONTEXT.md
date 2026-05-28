# CONTEXT.md

> Memória curta da última sessão (handoff — 27/05/2026).

## Referências
- `PRD.md` v2.1 (normativo) | `Sprints.md` (backlog oficial)

## Tasks concluídas nesta sessão (Sprint 8)
| ID | Título |
|----|--------|
| 10 | Papel `suporte` e usuário demo |
| 11 | API identidade M2M `GET /v1/integration/users/:id` |
| 12 | Multi-tenant: modelo + claim `tenant_id` |
| 13 | `X-Tenant-Id` + isolamento de consultas |
| 14 | Gateway multi-módulo |
| 15 | Seed apps M2M por squad |

## Última ação
Encerramento da sessão após task 15: apps `finance-fiscal`, `crm-leads`, `service-desk` no seed; documentação em `PERMISSIONS_MATRIX.md` §3.

## Estado atual
- **Sprint 8:** tasks **1–15** `done`; tasks **16–17** `pending` (roteiro CTO + demo 29/05).
- **Alicerce implementado no código:** suporte, identidade M2M, multi-tenant, gateway, seeds M2M.
- **Aguardando validação em deploy** antes de tasks 16–17 (decisão do squad).

## Pendências / débitos (pré-demo)
1. **Deploy/staging:** `prisma migrate deploy` + `npm run prisma:seed` com Postgres acessível.
2. **Smoke pós-deploy:** `scripts/gateway-smoke.sh`; login admin; token M2M `crm-leads` + `GET /v1/integration/users/:id` com `X-Tenant-Id`.
3. **E2E local:** `users-tenant.e2e.spec.ts`, `integration.e2e.spec.ts` — exigem `DATABASE_URL`.
4. **Task 16:** criar `docs/DEMO_CTO.md` (checklist 5 passos + cURLs).
5. **Task 17:** demo ao CTO em 29/05/2026.
6. **CI/cobertura:** débito ecossistema (Squad 5), fora do escopo desta sessão.

## Riscos / atenções
- Secrets M2M no seed são **somente demo** — rotacionar em produção (`PERMISSIONS_MATRIX.md` §3).
- Stubs `infra/mock-modules` não substituem APIs reais das squads 2–4.
- Escopo M2M de identidade é `identity:read` (não `users:read` no token M2M).
- `prisma generate` local falha sem `DATABASE_URL` no `.env` (usar `backend/.env`).

## Divergências PRD ↔ implementação
| Tema | PRD / backlog | Código atual |
|------|----------------|--------------|
| Escopo M2M identidade | menciona `users:read` ou `identity:read` | **`identity:read`** + endpoint dedicado `/v1/integration/users/:id` |
| Gateway | Portal Conexus (Squad 5) | **nginx no frontend** + stubs compose (contrato em `docs/GATEWAY.md`) |
| Tasks 16–17 | entrega 29/05 | **pendentes** — após testes em deploy |

## Credenciais demo (após seed)

**Humanos**
- Admin: `admin@hotmail.com` / `Admin12345!`
- Suporte: `suporte@example.com` / `Suporte123!`

**M2M** (`POST /v1/oauth/token`, `client_credentials`)

| client_id | client_secret | escopos principais |
|-----------|---------------|-------------------|
| `finance-fiscal` | `FinanceFiscal-Demo2026!` | `identity:read`, `finance:read` |
| `crm-leads` | `CrmLeads-Demo2026!` | `identity:read`, `customers:read` |
| `service-desk` | `ServiceDesk-Demo2026!` | `identity:read`, `tickets:read` |
| `test-client-id` | `test-client-secret` | QA / e2e |

**Tenant default:** `00000000-0000-4000-8000-000000000001` (`slug: default`)

## Gateway local
- Entrada: `http://localhost` (compose: `frontend` + `module-stubs` + `backend`)
- Core: `GET /v1/health` | Módulo stub: `GET /v1/crm/health`

## Próximo foco
**Após testes em deploy:** task **16** (`docs/DEMO_CTO.md`) → task **17** (apresentação CTO).

## Pronto para próxima sessão
1. Subir stack: `docker compose up -d --build` e rodar migrate + seed no ambiente de deploy.
2. Executar `sh scripts/gateway-smoke.sh` e validar fluxo M2M + isolamento tenant.
3. Com deploy OK, implementar task 16 e ensaiar roteiro da task 17.
