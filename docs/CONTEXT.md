# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 2 avancou ate a task 4: bootstrap NestJS com `/v1`, envelope global de sucesso/erro com `error.code`, guia de integracao e Swagger/OpenAPI em `/v1/docs`.

## Arquivos modificados recentemente
- `src/main.ts`
- `src/server/app.module.ts`
- `src/server/health/health.controller.ts`
- `src/server/health/health.module.ts`
- `src/server/prisma/prisma.module.ts`
- `src/server/prisma/prisma.service.ts`
- `src/server/common/response-envelope.interceptor.ts`
- `src/server/common/api-exception.filter.ts`
- `docs/INTEGRATION_API_CONTRACT.md`
- `package.json`
- `package-lock.json`
- `tsconfig.json`

## Estado atual
- API base NestJS ativa com prefixo global `/v1`.
- Endpoint `GET /v1/health` funcional com envelope de sucesso.
- Interceptor global de sucesso e filtro global de erros aplicados (com `error.code` e fallback por status).
- Swagger/OpenAPI 3 habilitado em ambiente de desenvolvimento em `/v1/docs`.
- Guia de contrato para consumidores publicado em `docs/INTEGRATION_API_CONTRACT.md`.
- Ajuste de contrato para 401 registrado: fallback `AUTH_TOKEN_INVALID` + override via `errorCode`/`code`.

## Pendencias e debitos
- Remover `dist/` do workspace/staging antes de novos commits (`dist/` e artefato gerado).
- Confirmar consistencia do `README.md` com a stack atual (migrou de Fastify puro para NestJS + adapter Fastify).
- Executar os itens restantes da Sprint 2: task 5 (Docker compose + variaveis) e task 6 (alinhar schema Prisma ao PRD).

## Riscos e atencoes
- Risco de confusao por commits fora da ordem de fechamento da sessao (operacional, sem impacto tecnico direto).
- Risco de regressao no contrato de erro 401 se futuros handlers nao aplicarem override correto (`AUTH_INVALID_CREDENTIALS` / `AUTH_TOKEN_EXPIRED` quando cabivel).
- Risco de documentacao divergente se Swagger e `docs/INTEGRATION_API_CONTRACT.md` nao forem mantidos juntos.
- Risco de `README.md` permanecer desatualizado em relacao ao estado real da API.

## Proximo foco
- Sprint 2, task 5: validar e documentar subida de app + Postgres via `docker-compose` com variaveis necessarias.
- Em seguida, Sprint 2, task 6: alinhar schema Prisma ao modelo alvo do PRD (RefreshToken/Application/Scope e regras associadas).

## Tasks concluidas na sessao
- Sprint 2 - Task 1: Bootstrap NestJS e modulos base (Common, Health) - Status `done`
- Sprint 2 - Task 2: Envelope de resposta e filtro de erros com `error.code` - Status `done`
- Sprint 2 - Task 3: Documentacao inicial de contrato e catalogo de erros - Status `done`
- Sprint 2 - Task 4: Swagger/OpenAPI 3 configurado e convencionado - Status `done`

## Observacoes uteis para a proxima sessao
- Sempre tratar `PRD.md` como contrato de produto e regras.
- Sempre tratar `Sprints.md` como contrato de execucao e prioridade.
- Se houver divergencia entre PRD e implementacao atual, registrar gap antes de propor alteracoes.
- Usar erros/logs reais do terminal e testes como insumo de prompt para depuracao e refinamento.
- Para erros 401: usar override de `error.code` no endpoint/guard quando necessario; fallback global atual e `AUTH_TOKEN_INVALID`.

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
