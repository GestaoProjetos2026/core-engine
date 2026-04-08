# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 3: concluidas as tasks 1 e 2 — `POST /v1/auth/register`, `POST /v1/auth/login` e `POST /v1/auth/refresh` com rotação de refresh (RF04/RN03); catalogo de erros ampliado para refresh; testes Vitest no `AuthService`.

## Arquivos modificados recentemente
- `src/modules/auth/*` — modulo Auth (DTOs, serviço, controlador, política de senha, util de TTL, specs).
- `src/server/app.module.ts` — import do `AuthModule`.
- `package.json` — dependencia `@nestjs/jwt`.
- `.env.example` — `BCRYPT_ROUNDS` e variaveis JWT/refresh já usadas pelo auth.
- `prisma/seed.ts` — alinhado ao schema atual (`Permission.code`, `Role` sem description extra).
- `docs/INTEGRATION_API_CONTRACT.md` — codigos `AUTH_REFRESH_INVALID` e `AUTH_REFRESH_REUSED`.
- `Sprints/Sprints.md` — `Status: done` nas tasks 1 e 2 da Sprint 3.

## Estado atual
- API NestJS + Fastify com prefixo `/v1`; `Health` e `Auth` ativos.
- Endpoints: `POST /v1/auth/register`, `POST /v1/auth/login`, `POST /v1/auth/refresh`; envelope de sucesso/erro global; Swagger em dev em `/v1/docs`.
- Access JWT (HS256) via `@nestjs/jwt` com claims alinhados ao PRD §16.1 no login/refresh; refresh opaco persistido com hash SHA-256; rotação com transação Prisma e `revokedAt`/`replacedById`.

## Pendencias e debitos
- Remover `dist/` do staging antes de commits quando aparecer como alterado local.
- Confirmar `README.md` e exemplos de quick start com os novos endpoints.
- Sprint 3 task 4 (Passport + `JwtAuthGuard`) ainda nao implementada — rotas protegidas por Bearer e `/me` dependem disso.
- Testes e2e (Sprint 3 task 6) ainda nao existem; apenas unitarios em `auth.service` e `auth-time.util`.

## Riscos e atencoes
- Manter Swagger e `INTEGRATION_API_CONTRACT.md` sincronizados para codigos 401 de auth/refresh.
- Item 4 da sprint pede Passport explicitamente; hoje a emissão JWT é Nest JWT sem Passport — nao é bug da task 1/2, mas há gap ate fechar task 4.
- Rate limit (RNF07) continua fora do escopo imediato das tasks 1–2; prever antes de go-live.

## Proximo foco
- Sprint 3, task 3: `GET /v1/auth/me` (RF08) com Bearer access e resposta documentada no Swagger — naturalmente apos/exige guard JWT (overlap com task 4; ordem pratica: guard + `/me` ou alinhar com backlog do time).

## Tasks concluidas na sessao
- Sprint 3 - Task 1: Registro e login e-mail/senha — `POST /v1/auth/register` e `POST /v1/auth/login` — Status `done`
- Sprint 3 - Task 2: Refresh token com rotação obrigatória — `POST /v1/auth/refresh` — Status `done`

## Observacoes uteis para a proxima sessao
- Tratar `PRD.md` e `Sprints.md` como contratos; nao mover itens de sprint nem inventar tasks.
- Para 401: login usa `AUTH_INVALID_CREDENTIALS`; refresh usa `AUTH_REFRESH_INVALID` / `AUTH_REFRESH_REUSED`; rotas com Bearer ainda cairao em `AUTH_TOKEN_INVALID` ate guards com overrides (`AUTH_TOKEN_EXPIRED`, etc.).
- Commits: usar `git commit -m "mensagem"` (sem `-m`, o Git interpreta o texto como pathspec).

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
