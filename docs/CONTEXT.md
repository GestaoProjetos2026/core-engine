# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal: `PRD.md` (v2.1)
- Fonte oficial de backlog: `Sprints.md`

## Ultima acao realizada
- **Sprint 8 task 10 concluida:** role `suporte`, permissoes `finance:*` / `tickets:*` no seed, usuario `suporte@example.com`, `PERMISSIONS_MATRIX.md`, teste unitario JWT sem `finance:*`.

## Arquivos modificados recentemente
- `backend/prisma/seed.ts`
- `docs/PERMISSIONS_MATRIX.md`
- `backend/src/modules/auth/auth.service.spec.ts`
- `Sprints/Sprints.md` (task 10 `done`)

## Estado atual
- **Sprint 8:** tasks 1–10 `done`; tasks 11–17 `pending`.
- Aplicar seed com Postgres: `cd backend && npm run prisma:seed`.

## Pendencias (tasks 11–17)
- **11** — `GET /v1/integration/users/:id` (M2M)
- **12–13** — multi-tenant
- **14** — gateway
- **15** — seeds M2M por squad
- **16–17** — demo CTO

## Riscos e atencoes
- Seed local falhou sem DB (`ECONNREFUSED`) — subir `docker compose` antes do seed.
- Squad 2 deve proteger rotas com `@RequirePermissions('finance:read')` etc.

## Proximo foco
- **Task 11** — endpoint M2M de identidade + escopo no seed.

## Tasks concluidas na sessao
- **Sprint 8 task 10** — Papel `suporte` e usuario demo.

## Pronto para proxima sessao
1. `docker compose up -d` e `npm run prisma:seed` no `backend/`.
2. Validar login: `suporte@example.com` / `Suporte123!` → `GET /v1/auth/me`.
3. Implementar task 11.
