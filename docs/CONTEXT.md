# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao

- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada

- Sprint 5: concluída Task 5 — `Pipeline CI: lint, testes, build (DoD)`. Pipeline em GitHub Actions criado para `pull_request`/`push` (branches principais), com serviços Postgres/Redis, migração Prisma e gates de lint, Prettier, testes unitários, testes e2e e build.

## Arquivos modificados recentemente

- `.github/workflows/ci.yml` — Workflow CI com quality gate completo (lint, format check, tests, build).
- `package.json` e `package-lock.json` — Scripts de qualidade/CI e dependência `typescript-eslint`.
- `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore` — Configuração inicial de lint e formatação.
- `README.md`, `docs/CONTEXT.md` e `docs/PRD_DEVELOPMENT.md` — Documentação e tracking da sprint atualizados.

## Estado atual

- Sprint 5 em andamento. Tasks 1, 2, 3, 4 e 5 concluídas.
- CI inicial do projeto implementado e versionado com validação automatizada de qualidade.

## Pendencias e debitos

- Próximas tasks da Sprint 5: Cobertura em módulos críticos (Task 6) e HTTP Helmet/CSP por ambiente (Task 7).
- Branch protection no GitHub ainda precisa exigir o check do workflow `CI` para bloqueio real de merge.

## Riscos e atencoes

- O esbuild (tsx de reload auto) apresenta gargalos de extração de metadados das classes no construtor de classes intermódulos. Os decorators `@Inject(X)` devem ser explícitos e manutenidos para qualquer injeção no constructor na pipeline atual de desenvolvimento para compilação ilesa a instabilidades.
- Em ambiente local, `prisma migrate deploy` falhou com `P3009` por histórico de migração previamente falha (`20260417231629_migration_test`), impedindo validação e2e integral nesta máquina até saneamento do estado do banco.

## Proximo foco

- Sprint 5 - Task 6: Cobertura de testes em módulos críticos (RNF05), com relatório no CI.

## Tasks concluidas na sessao

- Sprint 5 (Segurança Operacional e Finalização) - Task 5: Pipeline CI: lint, testes, build (DoD).

## Observacoes uteis para a proxima sessao

- A branch protection do GitHub deve exigir o status check do workflow `CI` para efetivamente bloquear merge em caso de falha, conforme DoD da task.
