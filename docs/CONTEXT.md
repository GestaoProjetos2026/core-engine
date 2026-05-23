# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Fechamento de sessao (Sprint 8 — frontend): migracao completa do admin para ADR-001 (`docs/PadraoFront/`), tasks 1–6 implementadas em `frontend/` com commits `#512`–`#517`; backlog e memoria (`Sprints.md`, `CONTEXT.md`, `PRD_DEVELOPMENT.md`) sincronizados. Tasks 7–9 marcadas `done` conforme encerramento do squad.

## Arquivos modificados recentemente (handoff documentacao)
- `Sprints/Sprints.md` — `Status: done` nas tasks 1–9 da Sprint 8.
- `docs/CONTEXT.md` — este arquivo.
- `docs/PRD_DEVELOPMENT.md` — registro Sprint 8 frontend + encerramento da sprint.

## Estado atual
- **Sprint 8:** encerrada no backlog (tasks 1–9 com `Status: done`).
- **Frontend admin (`frontend/`):** Design System ADR-001 aplicado (tokens, AppShell, UI base, CRUD, auth/dashboard, toasts/`PageLoading`).
- **Sprint 7:** Task 1 (`docs/INTEGRATION_GUIDE.md`) concluida; Tasks 2–3 (SDK/Workshop) pendentes no backlog.
- **Sprint 6:** Tasks 4–6 com `done`; Tasks 1–3 implementadas no codigo, marcacao `done` no `Sprints.md` ainda pendente de revisao formal de DoD.
- **Sprint 5:** CI (Task 5) e cobertura (Task 6) permanecem debito tecnico.

## Pendencias e debitos
- Sprint 7 — Tasks 2 e 3: SDK/Snippet e Workshop de Integracao.
- Sprint 6 — Tasks 1–3: alinhar `Status: done` no `Sprints.md` apos revisao de DoD (dashboard com API real em `/v1/dashboard`; metric cards ADR na Sprint 8).
- Sprint 5 — Pipeline CI e cobertura >=80% em modulos criticos.
- Pasta do app: usar `frontend/` (minusculo); referencias antigas a `Frontend/` no PRD_DEVELOPMENT devem ser tratadas como legado de path.

## Riscos e atencoes
- **RNF08 vs DTO backend:** formulario de criacao de usuario no admin valida senha forte; `POST /v1/users` no backend ainda aceita regra minima mais curta.
- **`GET /v1/applications`:** escopos carregados em paralelo por app na UI — ok para volume atual.
- **DI / esbuild (tsx):** manter `@Inject()` explicito em construtores no backend.
- **Build frontend:** `npm install` em `frontend/` antes de `npm run build` se `node_modules` ausente.

## Proximo foco
- Integrar branches de codigo da Sprint 8 (`#512`–`#517`) em `development` via PR/merge.
- Retomar Sprint 7 Tasks 2–3 ou debitos Sprint 5/6 conforme prioridade do squad.

## Tasks concluidas na sessao (Sprint 8 — escopo desta entrega)
- **Task 1:** Tokens CSS globais e fundacao do Design System (ADR-001).
- **Task 2:** AppShell — Sidebar e Topbar.
- **Task 3:** Biblioteca UI base (Button, Input, Card, Badge, Table).
- **Task 4:** Paginas CRUD (Users, Roles, Applications) + `AdminPages.css`.
- **Task 5:** Login, Register, Profile, Dashboard (metric cards).
- **Task 6:** Toasts e estados de carregamento (`ToastProvider`, `PageLoading`).
- **Tasks 7–9:** encerradas pelo squad (bug bash, auditoria, entrega final) — sem alteracao de codigo nesta sessao de frontend.

## Observacoes uteis para a proxima sessao
- Commits de codigo ja existem na branch `task/517-corecoreen-80-implementar-toasts-e-padronizar-feedback-de-operações` (inclui cadeia `#512`–`#517`).
- Documentacao de fechamento pode ir em branch dedicada a partir de `development`.
- Demo: login → dashboard → CRUD; validar toasts e tema azul ADR (`#0466c8` / `#001233`).

## Divergencias registradas (handoff)
- **Tasks 8–9 vs escopo desta sessao:** auditoria/performance e entrega final nao geraram diff em `frontend/` nesta sessao; `done` reflete encerramento do squad, nao implementacao local verificada aqui.
- **PRD §5.5** vs **Sprints.md:** frontend admin priorizado nas Sprints 6–8 apesar de P2 no PRD geral.
- **`Sprints.md` Sprint 6 Tasks 1–3:** codigo presente, `Status: done` ainda nao aplicado no backlog da Sprint 6.
