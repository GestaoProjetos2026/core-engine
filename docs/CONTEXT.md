# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Estabilizacao local do auth via HTTP: correcao de injecao de dependencias no Nest (`@Inject` em `AuthController` e `AuthService` para `AuthService`, `PrismaService`, `JwtService`); `PrismaModule` importado no `AuthModule`.
- `PrismaService` alinhado ao Prisma 7 com `@prisma/adapter-pg` + `pg` `Pool` (antes `new PrismaClient()` falhava em runtime).
- `docker-compose`: Postgres exposto em **5433** no host para evitar conflito com outra instancia em 5432; `.env.example` com `DATABASE_URL` em 5433.
- Swagger: respostas de auth documentadas com `schema.example` para evitar dependencia circular de metadata; `ApiExceptionFilter` regista `console.error` de excecoes nao-HTTP em ambiente nao-prod.
- Script `scripts/smoke-auth.ps1` validado (register, login, refresh, reuso de refresh).
- Orientacao para testes Postman/curl (JSON valido, POST, e-mail sem espacos no meio, UTF-8 sem BOM no Windows).

## Arquivos modificados recentemente
- `src/modules/auth/auth.controller.ts` / `auth.service.ts` / `auth.module.ts` — DI explicita e import do Prisma.
- `src/server/prisma/prisma.service.ts` — adapter PostgreSQL Prisma 7.
- `src/server/common/api-exception.filter.ts` — log de diagnosticos em dev.
- `docker-compose.yml` — mapeamento `5433:5432` para o servico postgres.
- `.env.example` — `DATABASE_URL` com porta 5433.
- `scripts/smoke-auth.ps1` — smoke end-to-end auth.

## Estado atual
- Com `npm run dev`, Postgres acessiveis conforme `.env` e schema sincronizado (`prisma db push` ou migrate aplicavel), os endpoints `POST /v1/auth/register`, `login` e `refresh` respondem com envelope padrao.
- A migracao historica `20260310213417_init` pode divergir do `schema.prisma` atual; em dev costuma usar-se `db push` ate existir migracao nova alinhada.

## Pendencias e debitos
- Gerar migracao Prisma oficial que substitua/alinhe o init antigo ao modelo atual (evitar apenas `db push` em ambientes partilhados).
- `README.md`: quick start com Docker (porta 5433), `migrate`/`db push`, `npm run dev`, link para `scripts/smoke-auth.ps1`.
- Sprint 3 tasks 3 e 4: `/me` e `JwtAuthGuard`/Passport ainda em aberto.
- Testes e2e (task 6) ausentes; unitarios Vitest em auth mantem-se.
- Remover `dist/` do staging antes de commits quando aparecer como alterado.

## Riscos e atencoes
- Reiniciar `npm run dev` apos mudancas em providers/DI para nao ficar processo antigo na porta 3000.
- No Windows, ficheiros JSON para `curl --data-binary @ficheiro` devem ser **UTF-8 sem BOM**; PowerShell `ConvertTo-Json` + `Set-Content` pode introduzir BOM e quebrar o parse no Fastify.
- PRD cita Passport na stack; task 4 da sprint ainda formaliza o guard — ate la, consumo por Bearer depende da proxima implementacao.

## Proximo foco
- Sprint 3, task 4: `JwtAuthGuard` (e Passport se for obrigatorio ao contrato) + task 3: `GET /v1/auth/me` com Bearer e Swagger.

## Tasks concluidas na sessao
- Nenhuma **nova** linha de backlog fechada nesta sessao (tasks 1 e 2 ja estavam entregues funcionalmente); esta sessao corrigiu **regressao de DI** e **stack local** para os mesmos endpoints funcionarem via HTTP/Postman.
- `Sprints/Sprints.md` e `Sprints.md`: `Status: done` mantido/sincronizado nas **Sprint 3 — tasks 1 e 2**.

## Observacoes uteis para a proxima sessao
- Tratar `PRD.md` e `Sprints.md` como contratos; nao mover sprint nem inventar item.
- `git commit -m "mensagem"` para mensagem de commit; mensagens em ingles se for convencao do repo.
- Erros auth: login `AUTH_INVALID_CREDENTIALS`; refresh `AUTH_REFRESH_INVALID` / `AUTH_REFRESH_REUSED`.

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
