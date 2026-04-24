# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 4: concluída task 7 — `Token M2M e OAuth token endpoint (RF17, RF21, RF22, RF23)`. Implementado endpoint OAuth 2.0 com suporte a `client_credentials` e `refresh_token`, incluindo suporte a `application/x-www-form-urlencoded`.

## Arquivos modificados recentemente
- `src/modules/integration/*` — Criado módulo de integração para fluxos OAuth M2M.
- `src/modules/applications/applications.service.ts` — Adicionado `validateCredentials`.
- `src/server/app.module.ts` — Registrado o `IntegrationModule`.
- `src/main.ts` — Configurado o Fastify para aceitar `x-www-form-urlencoded`.
- `test/integration.e2e.spec.ts` — Testes E2E para validação de tokens M2M.

## Estado atual
- Os CRUDs de Roles, Permissions e Applications estão completos.
- O sistema de emissão de tokens M2M (OAuth 2.0) está funcional e validado via testes E2E.
- Suporte a múltiplos content-types (`json` e `urlencoded`) implementado nos endpoints de token.

## Pendencias e debitos
- Nenhuma pendência crítica imediata para a Task 7.

## Riscos e atencoes
- Certifique-se de que `JWT_SECRET` está configurado corretamente no ambiente para que os tokens sejam assinados.

## Proximo foco
- Iniciar a Sprint 4 Task 8: JWT integração e ScopesGuard (RF18, CA07) — Implementar a validação de escopos no consumo das rotas via `@RequireScopes`.

## Tasks concluidas na sessao
- Sprint 4 - Task 7: Token M2M e OAuth token endpoint — Status `done`.

## Observacoes uteis para a proxima sessao
- Tratar \`PRD.md\` e \`Sprints.md\` como contratos.
- Os testes E2E do Nest+Fastify usam o \`app.inject()\` instanciado diretamente.
