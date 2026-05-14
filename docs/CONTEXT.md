# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 6 — Task 4 concluída: módulo de **Gestão de Usuários (CRUD)** no frontend (`Frontend/src/pages/UsersPage.tsx`), com listagem paginada, busca por e-mail, filtro de status, criação/edição (modais) e alteração de status integrados a `/v1/users`. Tipo `AdminUserListItem` adicionado em `Frontend/src/lib/types.ts`. `Sprints.md` atualizado com `Status: done` na Task 4. Encerramento de sessão via `prompts/close-session.txt` (sem commit no repositório).

## Arquivos modificados recentemente
- `Frontend/src/pages/UsersPage.tsx` — CRUD administrativo de usuários no UI.
- `Frontend/src/lib/types.ts` — tipo alinhado ao payload de `GET /v1/users`.
- `Sprints/Sprints.md` — status `done` na Task 4 da Sprint 6.
- `docs/CONTEXT.md` e `docs/PRD_DEVELOPMENT.md` — handoff e tracking.

## Estado atual
- Sprint 5: entregas principais concluídas; Tasks 5 e 6 (CI e cobertura) seguem como débito técnico documentado.
- Sprint 6: Tasks 1 e 2 já estavam entregues no código; Task 3 (Dashboard/Perfil) existe no repositório mas **não** recebeu `Status: done` no `Sprints.md` nesta sessão (sincronização pendente se o time validar critérios de aceite). **Task 4** marcada como `done` no backlog e documentação de desenvolvimento.

## Pendencias e debitos
- Sprint 6 — **Task 5** (RBAC UI) e **Task 6** (M2M Applications UI), conforme `Sprints.md`.
- Alinhar opcionalmente `Status: done` das Sprint 6 Tasks 1–3 no `Sprints.md` após revisão formal de DoD.
- Débitos Sprint 5: Pipeline CI (Task 5), cobertura em módulos críticos (Task 6).

## Riscos e atencoes
- O esbuild (tsx de reload auto) apresenta gargalos de extração de metadados das classes no construtor de classes intermódulos. Os decorators `@Inject(X)` devem ser explícitos e manutenidos para qualquer injeção no constructor na pipeline atual de desenvolvimento para compilação ilesa a instabilidades.
- **PRD (RNF08)** exige política de senha forte; o **admin `POST /v1/users`** valida apenas `MinLength(8)` no DTO — o formulário de criação no frontend aplica regra mais próxima do RNF08; criação direta pela API pode aceitar senhas mais fracas até o backend alinhar.

## Proximo foco
- Sprint 6 — **Task 5**: Gestão de Papéis e Permissões (RBAC) no frontend administrativo (`Sprints.md`).

## Tasks concluidas na sessao
- **Sprint 6 — Task 4:** Implementar Módulo de Gestão de Usuários (listagem com busca e paginação, formulários com validações, integração `/v1/users`).

## Observacoes uteis para a proxima sessao
- Build do frontend exige `npm install` no diretório `Frontend` antes de `npm run build` (dependências não versionadas em `node_modules`).
- O teste do `HealthService` foi construído de forma a não depender da daemon real do PostgreSQL ou do Redis, útil quando a pipeline CI (Sprint 5 Task 5) for ligada.

## Divergencias registradas (handoff)
- **`Sprints.md` vs código:** Tasks 1–3 da Sprint 6 não receberam `Status: done` nesta sessão; o código já contém setup, auth, dashboard e perfil — validar e marcar quando o time fechar DoD dessas tasks.
- **`PRD.md` §5.5** posiciona “frontend admin” como P2/roadmap curto; o **`Sprints.md`** já prevê Module 08 na Sprint 6 — priorização segue o backlog da sprint, com PRD como visão normativa geral.
