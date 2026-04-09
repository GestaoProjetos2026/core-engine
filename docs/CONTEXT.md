# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 3: concluida task 8 — `PermissionsGuard e decorator de permissão nas rotas admin`. Foram criados o decorator `@RequirePermissions(...)` e o `PermissionsGuard`, garantindo que o acesso a rotas protegidas exige a correspondência no array `perms` do usuário. A documentação (Swagger, erros PRD §19) foi respeitada com retorno `AUTHZ_FORBIDDEN`. E os testes do guard (vitest) foram adicionados atingindo total cobertura nestes cenários.

## Arquivos modificados recentemente
- `src/modules/auth/decorators/require-permissions.decorator.ts` — Novo decorator para setar metadados.
- `src/modules/auth/guards/permissions.guard.ts` — Guarda de autorização avaliando `req.user.perms`.
- `src/modules/auth/guards/permissions.guard.spec.ts` — Testes unitários utilizando vitest.
- `src/modules/auth/auth.module.ts` — Importação e provisionamento do guard.
- `docs/CONTEXT.md` — Atualizado nesta sessão.

## Estado atual
- API NestJS com prefixo `/v1` tendo Passport + JWT configurados.
- O RBAC inicial via JWT está pronto para ser utilizado localmente nas rotas pelas tags `@RequirePermissions`.
- Controle de erro 403 padronizado com envelope alinhado.
- Os testes rodam 100% no vitest.

## Pendencias e debitos
- Remover `dist/` do staging antes de commits quando aparecer como alterado local.
- O endpoint `/v1/auth/me` que e a task 3 da Sprint 3 deve ser a rota principal usando o nosso novo `JwtAuthGuard`.
- Testes e2e (Sprint 3 task 6) dependem dos endpoints humanos e agora do novo PermissionsGuard nas rotas sensíveis.
- Necessário realizar a integração formal do `PermissionsGuard` em controllers específicos do projeto ao criar essas controllers.

## Riscos e atencoes
- O `PermissionsGuard` pressupõe a execução bem-sucedida prévia de algum guard de autenticação (como `JwtAuthGuard`) para abastecer `req.user`. Usar os dois nas rotas `admin` em conjunto.
- O Swagger de autenticacao para Swagger bearer mode deve ser ativado quando a rota `/me` e as protecoes M2M entrarem.

## Proximo foco
- Próxima tarefa de acordo com a sequência acordada no Sprint task.

## Tasks concluidas na sessao
- Sprint 3 - Task 8: PermissionsGuard e decorator de permissão nas rotas admin — Status `done`

## Observacoes uteis para a proxima sessao
- Tratar `PRD.md` e `Sprints.md` como contratos; nao mover itens de sprint nem inventar tasks.
- Observação sobre os testes: Utilizamos `vitest` em vez de jest, logo as importações padrão (`describe`, `it`, `expect`, `vi`) estão no próprio `vitest`.

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
