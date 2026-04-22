# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 4: concluída task 2 — `Vínculos usuário–papel e papel–permissão (RF12, RF13)`. Implementados os endpoints de associação no `RolesModule`.

## Arquivos modificados recentemente
- `src/modules/roles/*` — Criado módulo de papéis.
- `src/modules/permissions/*` — Criado módulo de permissões.
- `src/server/app.module.ts` — Registrados os novos módulos.
- `prisma/seed.ts` — Adicionadas permissões de gerenciamento de roles/permissions.
- `docs/CONTEXT.md` — Atualizado nesta sessão.

## Estado atual
- Os CRUDs básicos de Roles e Permissions estão operacionais e documentados no Swagger.
- O sistema de autorização via `@RequirePermissions` está integrado aos novos endpoints.
- Seed do banco de dados atualizado para facilitar testes administrativos.

## Pendencias e debitos
- Implementar o seed de papéis/permissões iniciais (Sprint 4, Task 3).

## Riscos e atencoes
- Certifique-se de rodar `npx prisma db seed` para atualizar as permissões do usuário admin no banco local.

## Proximo foco
- Implementar os vínculos relacionais (RF12, RF13) para completar o sistema RBAC.

## Tasks concluidas na sessao
- Sprint 4 - Task 2: Vínculos usuário-papel e papel-permissão — Status `done`.

## Observacoes uteis para a proxima sessao
- Tratar \`PRD.md\` e \`Sprints.md\` como contratos.
- Os testes E2E do Nest+Fastify usam o \`app.inject()\` instanciado diretamente.
