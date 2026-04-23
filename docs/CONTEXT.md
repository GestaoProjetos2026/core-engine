# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 4: concluída task 5 — `CRUD de aplicações e regeneração de secret (RF14, RF15)`. Implementados controladores, services, e e2e test no `ApplicationsModule`.

## Arquivos modificados recentemente
- `src/modules/applications/*` — Criado módulo de aplicações.
- `src/server/app.module.ts` — Registrado o novo módulo.
- `test/applications.e2e.spec.ts` — Adicionados e2e testes.
- `docs/CONTEXT.md` e `PRD_DEVELOPMENT.md` — Atualizados nesta sessão.

## Estado atual
- Os CRUDs de Roles e Permissions estão completos, e agora o CRUD de Aplicações de negócios também está operacional, com controle de proteção de secret rigoroso.
- O sistema de autorização via `@RequirePermissions` está integrado aos novos endpoints.
- Seed do banco de dados atualizado para facilitar testes administrativos.

## Pendencias e debitos
- Retornar ao passo do banco de dados (se necessário resolver timeout/crash do Node.js nativo 25 durante migrações).

## Riscos e atencoes
- Certifique-se de rodar `npx prisma db seed` para atualizar as permissões do usuário admin no banco local.

## Proximo foco
- Iniciar a Sprint 4 Task 6: Catálogo de escopos e vínculo aplicação–escopo.

## Tasks concluidas na sessao
- Sprint 4 - Task 5: CRUD de aplicações e regeneração de secret — Status `done`.

## Observacoes uteis para a proxima sessao
- Tratar \`PRD.md\` e \`Sprints.md\` como contratos.
- Os testes E2E do Nest+Fastify usam o \`app.inject()\` instanciado diretamente.
