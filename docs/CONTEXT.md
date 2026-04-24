# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 4: concluída task 6 — `Catálogo de escopos e vínculo aplicação–escopo (RF16)`. Implementado catálogo global em `ScopesModule` e associação em `ApplicationsModule`.

## Arquivos modificados recentemente
- `src/modules/scopes/*` — Criado módulo de escopos (catálogo global).
- `src/modules/applications/*` — Atualizado para associação de escopos (GET/POST `/:id/scopes`).
- `src/server/app.module.ts` — Registrado o `ScopesModule`.
- `test/scopes.e2e.spec.ts` e `test/applications.e2e.spec.ts` — Testes E2E adicionados.
- `docs/CONTEXT.md` e `PRD_DEVELOPMENT.md` — Atualizados nesta sessão.

## Estado atual
- Os CRUDs de Roles, Permissions e Applications estão completos.
- O catálogo de Escopos para integração M2M foi criado e a associação N:N entre Aplicação e Escopo está funcional.
- O sistema de autorização via `@RequirePermissions` está integrado aos novos endpoints de escopos.

## Pendencias e debitos
- Retornar ao passo do banco de dados (se necessário resolver timeout/crash do Node.js nativo 25 durante migrações).

## Riscos e atencoes
- Certifique-se de rodar `npx prisma db seed` para atualizar as permissões do usuário admin no banco local.

## Proximo foco
- Iniciar a Sprint 4 Task 7: Token M2M e OAuth token endpoint (RF17, RF21, RF22, RF23) — `POST /v1/integration/token` e `POST /v1/oauth/token`.

## Tasks concluidas na sessao
- Sprint 4 - Task 6: Catálogo de escopos e vínculo aplicação–escopo — Status `done`.

## Observacoes uteis para a proxima sessao
- Tratar \`PRD.md\` e \`Sprints.md\` como contratos.
- Os testes E2E do Nest+Fastify usam o \`app.inject()\` instanciado diretamente.
