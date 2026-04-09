# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 3: concluida task 3 — `Endpoint GET /v1/auth/me (RF08)`. Implementada a rota que expõe os dados do perfil do usuário e suas autorizações (roles e perms) injetados pelo `JwtStrategy` através de um token Bearer válido, blindando especificamente chamadas para instâncias de tipo `user_access`. A nova rota foi coberta por testes no vitest simulando as extrações de claims.

## Arquivos modificados recentemente
- `src/modules/auth/auth.controller.ts` — Rota `@Get('me')` adicionada.
- `src/modules/auth/dto/auth-response.dto.ts` — DTO `UserProfileDto` incluído.
- `src/modules/auth/auth.controller.spec.ts` — Testes isolados garantindo sucesso de acesso, bem como recusa de requests sem token e/ou com payload pertencente a clients M2M (`integration_access`).
- `docs/CONTEXT.md` — Atualizado nesta sessão.

## Estado atual
- Os tokens JWT gerados via Auth já podem ter seu contexto lido localmente via endpoint `/v1/auth/me`.
- Tratamentos de Unauthorized para acessos vazios e limitadores de scope/type garantidos.
- Os testes the API restam 100% no vitest validando controllers de rotas.

## Pendencias e debitos
- Retirar/evitar pacotes antigos (`fastify/jwt` avulso, visto que a infra de API já conta com modulação oficial Nest para isto e guard de JWT pronto).
- Testes e2e (Sprint 3 task 6) dependem dos endpoints humanos e agora do novo PermissionsGuard nas rotas sensíveis. Devem ser integrados e validando os fluxos Auth Me + Auth Login em conjunto.
- O Seed Administrativo de base.

## Riscos e atencoes
- O Swagger de autenticacao para Swagger bearer mode deve ser ativado nas demais proteções `M2M`/App.
- Como o `vitest` executa fora da toolchain tradicional de Reflection do Nest(`tsc`), continue adotando injeções manuais via construtor nos `spec` tests de Unit quando possível.
- Evitar rodar o vitest contendo a flag `--exclude "dist/**"` omitida para evitar double test scan em módulos compilados comuns (arquivos .js).

## Proximo foco
- Completar as tarefas e2e de Auth da Sprint 3 (como a Task 6).

## Tasks concluidas na sessao
- Sprint 3 - Task 3: Endpoint `GET /v1/auth/me` (RF08) — Status `done`
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
