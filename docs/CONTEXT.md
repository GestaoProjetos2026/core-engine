# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 6 — Task 6 concluída: implementação completa da Interface de Aplicações M2M e Escopos no frontend (`Frontend/src/pages/ApplicationsPage.tsx`). CRUD de aplicações, modal de exibição única de `client_secret` (criação e regeneração, RN02), gestão de escopos por aplicação via multiselect (`GET/POST /v1/applications/:id/scopes`). Tipos `ApplicationListItem`, `ApplicationWithSecret` e `Scope` em `Frontend/src/lib/types.ts`. Encerramento via `prompts/close-session.txt`.

## Arquivos modificados recentemente
- `Frontend/src/pages/ApplicationsPage.tsx` — CRUD, paginação, filtros, modal de secret one-time, modal de escopos N:N.
- `Frontend/src/lib/types.ts` — tipos de aplicação M2M e escopo.
- `Sprints/Sprints.md` — `Status: done` na Task 6 da Sprint 6.
- `docs/CONTEXT.md` e `docs/PRD_DEVELOPMENT.md` — handoff e tracking.

## Estado atual
- Sprint 5: entregas principais concluídas; Tasks 5 e 6 (CI e cobertura) seguem como débito técnico documentado.
- Sprint 6: Tasks 4, 5 e 6 com `Status: done` no backlog. Tasks 1–3 implementadas no código (setup, auth, dashboard/perfil) mas **sem** `Status: done` formal no `Sprints.md` — métricas do dashboard permanecem mockadas.
- Módulo 08 (Frontend Administrativo): funcionalidades previstas na Sprint 6 entregues no repositório; pendente revisão de DoD das Tasks 1–3.

## Pendencias e debitos
- Alinhar opcionalmente `Status: done` das Sprint 6 Tasks 1–3 no `Sprints.md` após revisão formal de DoD (dashboard com métricas reais vs. mock).
- Débitos Sprint 5: Pipeline CI (Task 5), cobertura em módulos críticos (Task 6).
- `src/modules/auth/auth.controller.ts` modificado no working tree (fora do escopo da Task 6 desta sessão) — revisar antes de commit.

## Riscos e atencoes
- O esbuild (tsx de reload auto) apresenta gargalos de extração de metadados das classes no construtor de classes intermódulos. Os decorators `@Inject(X)` devem ser explícitos e manutenidos para qualquer injeção no constructor na pipeline atual de desenvolvimento para compilação ilesa a instabilidades.
- **PRD (RNF08)** exige política de senha forte; o **admin `POST /v1/users`** valida apenas `MinLength(8)` no DTO — o formulário de criação no frontend aplica regra mais próxima do RNF08; criação direta pela API pode aceitar senhas mais fracas até o backend alinhar.
- Listagem de aplicações (`GET /v1/applications`) não inclui escopos no payload; o frontend carrega escopos por app em paralelo (`GET /v1/applications/:id/scopes`) na página atual — aceitável para páginas pequenas; considerar otimização se o volume crescer.

## Proximo foco
- Sprint 7 — **Task 1**: Guia de Integração para Outros Módulos (`Sprints.md`).

## Tasks concluidas na sessao
- **Sprint 6 — Task 6:** Implementar Interface para Aplicações e Escopos (M2M).

## Observacoes uteis para a proxima sessao
- Build do frontend exige `npm install` no diretório `Frontend` antes de `npm run build` (dependências não versionadas em `node_modules`).
- Demo M2M: após criar app no admin, validar token com `POST /v1/oauth/token` (`grant_type: client_credentials`) usando `client_id` e `client_secret` copiados no modal one-time.

## Divergencias registradas (handoff)
- **`Sprints.md` vs código:** Tasks 1–3 da Sprint 6 não receberam `Status: done`; código contém setup, auth, dashboard e perfil — dashboard usa métricas mockadas (critério de aceite permite mock, mas vale validação do time).
- **`PRD.md` §5.5** posiciona “frontend admin” como P2/roadmap curto; o **`Sprints.md`** já prevê Module 08 na Sprint 6 — priorização segue o backlog da sprint, com PRD como visão normativa geral.
