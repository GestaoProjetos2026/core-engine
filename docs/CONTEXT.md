# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md` (v2.1)
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Atualizacao normativa do `PRD.md` para **v2.1**: multi-tenant logico (RF25–RF27), API M2M de identidade (RF29), gateway (RF28), papel `suporte` (RF30), entregaveis Alicerce (§5.8) e dependencias entre squads (§5.7). Task 11 do backlog mantida (`GET /v1/integration/users/:id`). Encerramento de sessao conforme `prompts/close-session.txt`.

## Arquivos modificados recentemente (handoff documentacao)
- `PRD.md` — amendamento v2.1 (multi-tenant, integracao, gateway, suporte).
- `Sprints/Sprints.md` — Sprint 8 ate 29/05 com tasks 10–17; Sprints 5–7 encerradas (sessao anterior).
- `docs/CONTEXT.md` — este arquivo.
- `docs/PRD_DEVELOPMENT.md` — registro da sessao e divergencias.

## Estado atual
- **Sprint 8 (23/05–29/05):** em andamento — tasks 1–9 `done` (frontend ADR-001); tasks 10–17 `pending` (implementacao Alicerce + demo CTO).
- **PRD v2.1** alinhado ao backlog Sprint 8; **implementacao** das RF25–RF30 ainda pendente no codigo.
- **Sprints 5, 6 e 7:** encerradas no backlog; **RNF08** implementada.

## Pendencias e debitos (Sprint 8, tasks 10–17)
- **10** — role `suporte` + usuario demo + `PERMISSIONS_MATRIX.md`
- **11** — `GET /v1/integration/users/:id` (M2M + escopo); distinto de `GET /v1/users/:id` (RBAC humano)
- **12–13** — Tenant, claim `tenant_id`, header `X-Tenant-Id`, filtro Prisma
- **14** — gateway multi-modulo + `docs/GATEWAY.md`
- **15** — seed apps M2M por squad
- **16** — `docs/DEMO_CTO.md`
- **17** — demo CTO 29/05/2026

## Riscos e atencoes
- **PRD vs codigo:** v2.1 descreve capacidades ainda nao implementadas — priorizar tasks 10–11 antes da demo.
- **`GET /v1/users/:id`:** nao substitui task 11 para token M2M (`PermissionsGuard` exige `perms`).
- **Multi-tenant avancado** (cross-tenant admin, billing) permanece fora do escopo — §25 PRD.
- **Build frontend:** `npm install` em `frontend/` antes de `npm run build` se `node_modules` ausente.

## Proximo foco
- Implementar Sprint 8 **task 10** (role `suporte`) em seguida **task 11** (endpoint integracao M2M), depois 12–13 (tenant), 14 (gateway), 15 (seeds M2M).

## Tasks concluidas na sessao (documentacao — nao codigo)
- Nenhuma task de implementacao 10–17 marcada `done` nesta sessao.
- Entregavel de sessao: **PRD v2.1** publicado e handoff atualizado.

## Divergencias registradas (handoff)
- **PRD v2.0 → v2.1:** multi-tenant entrou no escopo normativo; codigo e migrations ainda refletem modelo single-tenant ate tasks 12–13.
- **Task 11:** mantida como endpoint dedicado M2M; `GET /v1/users/:id` permanece apenas para fluxo humano com `users:read`.

## Pronto para proxima sessao
1. Rodar `git pull` / branch de trabalho alinhada a `main` ou `development`.
2. Iniciar **Sprint 8 task 10** (`prisma/seed.ts`: role `suporte`, usuario demo).
3. Implementar **task 11** (`IntegrationModule` + `GET /v1/integration/users/:id` + escopo no seed).
4. Validar com cURL: login `suporte@...` e `client_credentials` de app de teste.
5. Atualizar `docs/INTEGRATION_GUIDE.md` apos task 11.
