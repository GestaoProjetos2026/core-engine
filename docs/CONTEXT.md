# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 3: concluida task 9 — `CRUD de usuários (RF09) com permissões administrativas`. Foram implementados os verbos `GET/POST/PATCH` em `/v1/users` e o status update em `/v1/users/:id/status`. As rotas foram protegidas com `@UseGuards(JwtAuthGuard, PermissionsGuard)` e o decorator `@RequirePermissions()`, associando 'users:read' para leitura e 'users:write' para mutação. Casos de borda contendo duplicidade (e-mail) com `409 Conflict` e usuários inativos foram cobertos e integrados ao `class-validator/class-transformer`. O ambiente de testes com `vitest` também cobre toda lógica em controller e service injetando os mocks equivalentes no bypass do emitDecoratorMetadata.

## Arquivos modificados recentemente
- `src/modules/users/users.module.ts` — Nova feature module adicionada e referenciada no `app.module.ts`.
- `src/modules/users/users.controller.ts` e `src/modules/users/users.service.ts` — Lógica e rotas de Users.
- `src/modules/users/dto/*` — Schemas NestJS (`fastify-schema` e `routes` legados foram deletados em prol da arquitetura oficial do NestJS).
- `src/modules/users/users.controller.spec.ts` e `users.service.spec.ts` — Unit tests.
- `docs/CONTEXT.md` — Atualizado nesta sessão.

## Estado atual
- API NestJS com prefixo `/v1` tendo Passport + JWT configurados.
- CRUD administrativo de usuários concluído, aplicando checagem de permissão via JWT e JwtGuard (RF09 e CA08 cumpridos).
- `PrismaService` respondendo corretamente para o catálogo de exceções unificado do Nest.
- Os testes rodam 100% no vitest.

## Pendencias e debitos
- Retirar/evitar pacotes antigos (`fastify/jwt` avulso, visto que a infra de API já conta com modulação oficial Nest para isto e guard de JWT pronto).
- O endpoint `/v1/auth/me` que e a task 3 da Sprint 3 deve ser a rota principal usando o nosso novo `JwtAuthGuard`. (E é provável focar na autorização/refatoração final de Auth).
- Testes e2e (Sprint 3 task 6) dependem dos endpoints humanos e agora do novo PermissionsGuard nas rotas sensíveis.
- O Seed Administrativo de base.

## Riscos e atencoes
- O Swagger de autenticacao para Swagger bearer mode deve ser ativado nas demais proteções `M2M`/App.
- Como o `vitest` executa fora da toolchain tradicional de Reflection do Nest(`tsc`), é imperativo construir providers de instanciação manual ou resolver via stub se os controllers passarem a ter mais de 4 ou 5 injetáveis.

## Proximo foco
- As tarefas de Auth estantes em Sprint 3: `GET /v1/auth/me` ou Testes E2E (Tasks 3 e 6), validando JWT flow final humano.

## Tasks concluidas na sessao
- Sprint 3 - Task 9: CRUD de usuários (RF09) com permissões administrativas — Status `done`


## Observacoes uteis para a proxima sessao
- Tratar `PRD.md` e `Sprints.md` como contratos; nao mover itens de sprint nem inventar tasks.
- Observação sobre os testes: Utilizamos `vitest` em vez de jest. Fazer importação de mocks nativos sempre do `vitest`.

## Template de atualizacao rapida (copiar e preencher)
```md
## Ultima acao realizada
- ...

## Arquivos modificados recentemente
- ...

## Estado atual
- ...

## Pendencias e debitos
- ...

## Riscos e atencoes
- ...

## Proximo foco
- ...

## Tasks concluidas na sessao
- ...

## Observacoes uteis para a proxima sessao
- ...
```
