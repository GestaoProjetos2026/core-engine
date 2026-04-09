# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 3: concluida task 4 — `Emissão JWT access e estratégia Passport`. Instaladas as dependencias de passport, criados `JwtStrategy` e `JwtAuthGuard`. Modulo `AuthModule` agora provee a integracao com o passport. Atualizada tipagem do prisma (`npx prisma generate`) para que os testes finalizassem corretamente.

## Arquivos modificados recentemente
- `src/modules/auth/auth.module.ts` — Importacao do `PassportModule` e provider `JwtStrategy`.
- `src/modules/auth/jwt.strategy.ts` — Classe para validacao de payload `user_access`.
- `src/modules/auth/jwt-auth.guard.ts` — Guard default para endpoints protegidos.
- `package.json` — Incremento das libs relacionadas ao `passport`.
- `test.log` / `test-result.txt` — Artefatos temporarios de validacao de testes.
- `docs/CONTEXT.md` — Atualizado nesta sessao.

## Estado atual
- API NestJS com prefixo `/v1` tendo Passport + JWT 100% configurado para a emissao de tokens humanos e de maquina (base do `jwt.strategy` e payloads flexiveis adaptados à secao 16.1 e 16.2 do PRD).
- Testes unitarios estao passando. O Swagger continua sem o `/me` ainda.

## Pendencias e debitos
- Remover `dist/` do staging antes de commits quando aparecer como alterado local.
- O endpoint `/v1/auth/me` que e a task 3 da Sprint 3 deve ser a rota principal usando o nosso novo `JwtAuthGuard`.
- Testes e2e (Sprint 3 task 6) dependem dos endpoints humanos.

## Riscos e atencoes
- O Swagger de autenticacao para Swagger bearer mode deve ser ativado quando o rota `/me` e as protecoes M2M entrarem.

## Proximo foco
- Sprint 3, task 3: `GET /v1/auth/me` (RF08) com Bearer access e resposta documentada no Swagger, usando o novo guard criado hoje.

## Tasks concluidas na sessao
- Sprint 3 - Task 4: Emissão JWT access (HS256, RNF03/RNF04) e estratégia Passport — Status `done`

## Observacoes uteis para a proxima sessao
- Tratar `PRD.md` e `Sprints.md` como contratos; nao mover itens de sprint nem inventar tasks.
- A estrategia de autenticacao ` पासपोर्ट` valida as *claims* garantindo que ha o identificador 'sub' e extraimos 'userId', 'roles' e 'perms' injetando-os em `req.user`.

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
