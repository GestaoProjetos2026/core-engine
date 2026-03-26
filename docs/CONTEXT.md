# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 2 avancou e concluiu as tasks 5 e 6: configuracao do docker-compose com variaveis dev, e alinhamento do schema Prisma com os modelos do PRD.

## Arquivos modificados recentemente
- `.env.example`
- `prisma/schema.prisma`
- `src/server/prisma/prisma.service.ts`

## Estado atual
- API base NestJS ativa com prefixo global `/v1`.
- Endpoint `GET /v1/health` funcional com envelope de sucesso.
- Setup de variáveis dev pronto e schema Prisma aderente ao modelo do PRD (RBAC, RefreshToken, Integration, OAuth scopes listos no prisma).

## Pendencias e debitos
- Remover `dist/` do workspace/staging antes de novos commits (`dist/` e artefato gerado).
- Confirmar consistencia do `README.md` com a stack atual.

## Riscos e atencoes
- Risco de confusao por commits fora da ordem de fechamento da sessao (operacional, sem impacto tecnico direto).
- Risco de regressao no contrato de erro 401 se futuros handlers nao aplicarem override correto (`AUTH_INVALID_CREDENTIALS` / `AUTH_TOKEN_EXPIRED` quando cabivel).
- Risco de documentacao divergente se Swagger e `docs/INTEGRATION_API_CONTRACT.md` nao forem mantidos juntos.
- Risco de `README.md` permanecer desatualizado em relacao ao estado real da API.

## Proximo foco
- Revisão de DoD e encerramento MVP (§23) se aplicável, ou passar para a Sprint 3: Registro e login e-mail/senha.

## Tasks concluidas na sessao
- Sprint 2 - Task 1: Bootstrap NestJS e modulos base (Common, Health) - Status `done`
- Sprint 2 - Task 2: Envelope de resposta e filtro de erros com `error.code` - Status `done`
- Sprint 2 - Task 3: Documentacao inicial de contrato e catalogo de erros - Status `done`
- Sprint 2 - Task 4: Swagger/OpenAPI 3 configurado e convencionado - Status `done`
- Sprint 2 - Task 5: Docker Compose e variaveis para desenvolvimento - Status `done`
- Sprint 2 - Task 6: Alinhar schema Prisma ao PRD - Status `done`

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
