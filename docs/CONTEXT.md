# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 4: concluída task 4 — `Publicar matriz de permissões por endpoint administrativo`.

## Arquivos modificados recentemente
- `docs/PERMISSIONS_MATRIX.md` — Matriz oficial `endpoint x permission.code` para endpoints administrativos.
- `docs/JWT_GUIDE.md` — Referência cruzada para a matriz oficial de permissões.
- `docs/INTEGRATION_API_CONTRACT.md` — Referência cruzada para matriz RBAC e guia JWT.
- `Sprints/Sprints.md` — Sprint 4 Task 4 marcada como `done`.
- `docs/CONTEXT.md` — Atualizado nesta sessão.

## Estado atual
- Os CRUDs básicos de Roles e Permissions estão operacionais e documentados no Swagger.
- O sistema de autorização via `@RequirePermissions` está integrado aos novos endpoints.
- Matriz oficial de permissões por endpoint administrativo foi publicada e versionada no repositório.
- Referência cruzada entre matriz, Swagger (`/v1/docs`) e guias de integração foi estabelecida.

## Pendencias e debitos
- Revisar o histórico de migrations locais para evitar conflito no `prisma migrate deploy` (`type "UserStatus" already exists`).

## Riscos e atencoes
- Certifique-se de subir o banco antes de executar `npm run prisma:seed` e `npm test`, evitando `ECONNREFUSED`.
- Em ambientes com banco já provisionado, validar migrations antigas antes de usar `prisma migrate deploy`.

## Proximo foco
- Sprint 4 - Task 5: CRUD de aplicações e regeneração de secret (RF14, RF15).

## Tasks concluidas na sessao
- Sprint 4 - Task 3: Seed inicial RBAC + teste e2e 403 — Status `done`.
- Sprint 4 - Task 4: Matriz de permissões por endpoint administrativo — Status `done`.

## Observacoes uteis para a proxima sessao
- Tratar \`PRD.md\` e \`Sprints.md\` como contratos.
- Os testes E2E do Nest+Fastify usam o \`app.inject()\` instanciado diretamente.
