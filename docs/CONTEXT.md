# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 8 — **Task 2 concluída**: `Layout.css` / `Layout.tsx` refatorados para AppShell ADR — sidebar 240px (`--color-bg-sidebar`), item ativo com `--color-brand-muted` + borda esquerda brand, topbar 56px (`--color-bg-header`), ícones de nav com estados muted/brand, logo `--color-icon-brand`, logout com `--color-danger`. Mobile overlay preservado. Build OK.

## Arquivos modificados recentemente
- `frontend/src/components/Layout.css` — AppShell ADR (sidebar, topbar, nav ativo).
- `frontend/src/components/Layout.tsx` — logo via classe CSS, a11y nos botões mobile.
- `docs/CONTEXT.md` — atualizado (esta sessão).
- `docs/CONTEXT.md` — atualizado (esta sessão).
- `docs/PRD_DEVELOPMENT.md` — Sprint 7 Task 1 registrada como concluída.

## Estado atual
- Sprint 5: entregas principais concluídas; Tasks 5 e 6 (CI e cobertura) seguem como débito técnico documentado.
- Sprint 6: Tasks 4, 5 e 6 com `Status: done` no backlog. Tasks 1–3 implementadas no código (setup, auth, dashboard/perfil) mas **sem** `Status: done` formal no `Sprints.md` — métricas do dashboard permanecem mockadas.
- Módulo 08 (Frontend Administrativo): funcionalidades previstas na Sprint 6 entregues no repositório; pendente revisão de DoD das Tasks 1–3.
- **Sprint 7: Task 1 concluída** — `docs/INTEGRATION_GUIDE.md` criado. Tasks 2 e 3 (SDK/Snippet e Workshop) pendentes.

## Pendencias e debitos
- Alinhar opcionalmente `Status: done` das Sprint 6 Tasks 1–3 no `Sprints.md` após revisão formal de DoD (dashboard com métricas reais vs. mock).
- Débitos Sprint 5: Pipeline CI (Task 5), cobertura em módulos críticos (Task 6).
- `src/modules/auth/auth.controller.ts` modificado no working tree (fora do escopo da Task 6 desta sessão) — revisar antes de commit.

## Riscos e atencoes
- O esbuild (tsx de reload auto) apresenta gargalos de extração de metadados das classes no construtor de classes intermódulos. Os decorators `@Inject(X)` devem ser explícitos e manutenidos para qualquer injeção no constructor na pipeline atual de desenvolvimento para compilação ilesa a instabilidades.
- **PRD (RNF08)** exige política de senha forte; o **admin `POST /v1/users`** valida apenas `MinLength(8)` no DTO — o formulário de criação no frontend aplica regra mais próxima do RNF08; criação direta pela API pode aceitar senhas mais fracas até o backend alinhar.
- Listagem de aplicações (`GET /v1/applications`) não inclui escopos no payload; o frontend carrega escopos por app em paralelo (`GET /v1/applications/:id/scopes`) na página atual — aceitável para páginas pequenas; considerar otimização se o volume crescer.

## Proximo foco
- Sprint 8 — **Task 3**: Biblioteca UI base (`Button`, `Input`, `Card`, `Badge`, `Table`) em `frontend/src/components/ui/`.
- Sprint 7 (pendente): Tasks 2–3 — SDK/Snippet e Workshop de Integração.

## Tasks concluidas na sessao
- **Sprint 7 — Task 1:** Criar Documentação Técnica de Integração (`docs/INTEGRATION_GUIDE.md`).

## Observacoes uteis para a proxima sessao
- Build do frontend exige `npm install` no diretório `Frontend` antes de `npm run build` (dependências não versionadas em `node_modules`).
- Demo M2M: após criar app no admin, validar token com `POST /v1/oauth/token` (`grant_type: client_credentials`) usando `client_id` e `client_secret` copiados no modal one-time.
- `docs/INTEGRATION_GUIDE.md` cobre M2M + RBAC humano + exemplos Node.js/Python + fluxogramas Mermaid; referenciá-lo no README se ainda não estiver linkado.
- Sprint 8 inicia em 23/05/2026 — foco em Bug Bash, auditoria de segurança e entrega final.

## Divergencias registradas (handoff)
- **`Sprints.md` vs código:** Tasks 1–3 da Sprint 6 não receberam `Status: done`; código contém setup, auth, dashboard e perfil — dashboard usa métricas mockadas (critério de aceite permite mock, mas vale validação do time).
- **`PRD.md` §5.5** posiciona "frontend admin" como P2/roadmap curto; o **`Sprints.md`** já prevê Module 08 na Sprint 6 — priorização segue o backlog da sprint, com PRD como visão normativa geral.
- **Sprint 7 prazo:** encerra em 22/05/2026; Tasks 2 e 3 (SDK e Workshop) ficam como pendência para encerrar dentro da sprint ou avaliar como débito.
