# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 4: concluída task 3 — `Seed de papéis/permissões iniciais e teste e2e 403`.

## Arquivos modificados recentemente
- `prisma/seed.ts` — Matriz inicial de papéis `admin`, `manager`, `operator`, `viewer` e vínculo automático com permissões.
- `test/rbac.e2e.spec.ts` — Teste e2e cobrindo 403 para usuário sem `users:write`.
- `docs/JWT_GUIDE.md` — Documentação dos `permission.code` iniciais e matriz por papel.
- `docs/CONTEXT.md` — Atualizado nesta sessão.

## Estado atual
- Os CRUDs básicos de Roles e Permissions estão operacionais e documentados no Swagger.
- O sistema de autorização via `@RequirePermissions` está integrado aos novos endpoints.
- Seed do banco de dados agora cria papéis base de RBAC e usuários padrão por papel.
- Existe teste e2e específico para bloqueio de escrita com retorno `AUTHZ_FORBIDDEN`.
- Suíte de testes validada com sucesso: `31 passed (31)`.

## Pendencias e debitos
- Revisar o histórico de migrations locais para evitar conflito no `prisma migrate deploy` (`type "UserStatus" already exists`).

## Riscos e atencoes
- Certifique-se de subir o banco antes de executar `npm run prisma:seed` e `npm test`, evitando `ECONNREFUSED`.
- Em ambientes com banco já provisionado, validar migrations antigas antes de usar `prisma migrate deploy`.

## Proximo foco
- Sprint 4 - Task 4: mapear permissões por endpoint para reuso por outros squads.

## Tasks concluidas na sessao
- Sprint 4 - Task 3: Seed inicial RBAC + teste e2e 403 — Status `done`.

## Observacoes uteis para a proxima sessao
- Tratar \`PRD.md\` e \`Sprints.md\` como contratos.
- Os testes E2E do Nest+Fastify usam o \`app.inject()\` instanciado diretamente.
