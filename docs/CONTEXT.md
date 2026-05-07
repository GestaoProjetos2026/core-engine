# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 5: concluída Task 8 — `README e exemplos públicos`. Adicionado no `README.md` a seção de Início Rápido com exemplos em `curl` dos fluxos Humano e M2M, além de atualizado o checklist de Definition of Done (DoD).

## Arquivos modificados recentemente
- `README.md` — Adicionados exemplos práticos de curl e checklist de DoD.
- `docs/CONTEXT.md` e `docs/PRD_DEVELOPMENT.md` — Tracking de progresso da sprint.

## Estado atual
- Sprint 5 em andamento. Tasks 1, 2, 3, 4, 7 e 8 concluídas.
- Carga de observabilidade, segurança de cabeçalhos HTTP e exemplos públicos adicionados com sucesso.

## Pendencias e debitos
- Próximas tasks da Sprint 5: Pipeline CI (Task 5), Cobertura em módulos críticos (Task 6).

## Riscos e atencoes
- O esbuild (tsx de reload auto) apresenta gargalos de extração de metadados das classes no construtor de classes intermódulos. Os decorators `@Inject(X)` devem ser explícitos e manutenidos para qualquer injeção no constructor na pipeline atual de desenvolvimento para compilação ilesa a instabilidades.

## Proximo foco
- Sprint 5 - Task 5: Pipeline CI: lint, testes, build (DoD). Adicionar GitHub Actions para o repositório rodar o pipeline automático antes de cada integração de PR.

## Tasks concluidas na sessao
- Sprint 5 - Task 8: README e exemplos públicos (README, §23 DoD).

## Observacoes uteis para a proxima sessao
- O teste do `HealthService` foi contruído de forma a não depender da daemon real do PostgreSQL ou do Redis. Isso garante a flexibilidade exigida numa pipeline de CI que será implementada na Task 5.
