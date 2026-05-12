# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 5: concluída Task 9 — `Seed final de papéis e matriz de permission.code (P1)`. Consolidado o catálogo de permissões e escopos no `prisma/seed.ts` e criado o documento normativo `docs/PERMISSIONS_MATRIX.md`.

## Arquivos modificados recentemente
- `prisma/seed.ts` — Expandido com novas permissões e escopos.
- `docs/PERMISSIONS_MATRIX.md` — Documentação consolidada da matriz de acessos.
- `docs/CONTEXT.md` e `docs/PRD_DEVELOPMENT.md` — Tracking de progresso.

## Estado atual
- Sprint 5 concluída (Tasks 1-4, 7-10 concluídas; Tasks 5 e 6 postergadas como débito técnico).
- Sprint 6 iniciada. Task 1 (Setup) e Task 2 (Fluxo de Auth e Proteção) concluídas.
- Frontend validado com build, lint e refinamentos de UX.

## Pendencias e debitos
- Próximas tasks da Sprint 6: Task 3 (Dashboard e Perfil), Task 4 (CRUD de Usuários).
- Débitos técnicos da Sprint 5: Pipeline CI (Task 5), Cobertura em módulos críticos (Task 6).

## Riscos e atencoes
- O esbuild (tsx de reload auto) apresenta gargalos de extração de metadados das classes no construtor de classes intermódulos. Os decorators `@Inject(X)` devem ser explícitos e manutenidos para qualquer injeção no constructor na pipeline atual de desenvolvimento para compilação ilesa a instabilidades.

## Proximo foco
- Sprint 5 - Task 5: Pipeline CI: lint, testes, build (DoD). Adicionar GitHub Actions para o repositório rodar o pipeline automático antes de cada integração de PR.

## Tasks concluidas na sessao
- Sprint 5 - Task 9: Seed final de papéis e matriz de permission.code (P1).

## Observacoes uteis para a proxima sessao
- O teste do `HealthService` foi contruído de forma a não depender da daemon real do PostgreSQL ou do Redis. Isso garante a flexibilidade exigida numa pipeline de CI que será implementada na Task 5.
