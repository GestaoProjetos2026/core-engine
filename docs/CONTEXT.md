# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 4: concluída task 10 — `OpenAPI: token endpoint OAuth e erros alinhados à RFC (RF20)`. Adicionadas as documentações detalhadas de esquema inline para respostas OAuth2 na API.

## Arquivos modificados recentemente
- `docs/M2M_INTEGRATION_GUIDE.md` — **Novo.** Guia público de integração M2M para parceiros externos com exemplos `curl`, escopos, erros OAuth e boas práticas.
- `docs/JWT_GUIDE.md` — Corrigida nota "ScopesGuard será implementado na Sprint 5" → já implementado na Sprint 4 Task 8. Adicionados links para `M2M_INTEGRATION_GUIDE.md` e `SCOPES_GUARD_TEST_GUIDE.md`.
- `README.md` — Tabela de endpoints atualizada para Sprint 4 (todas as rotas ✅). Tabela de documentação expandida com o novo guia M2M.
- `docs/PRD_DEVELOPMENT.md` — Task 9 marcada como concluída.

## Estado atual
- Tasks 1 a 10 da Sprint 4 estão concluídas.
- O Swagger agora exibe os erros de OAuth2 corretamente utilizando os envelopes da aplicação.

## Pendencias e debitos
- Task 11 da Sprint 4 ainda pendente:
  - Task 11: Testes e2e M2M e spike manual com aplicação de teste

## Riscos e atencoes
- O padrão de teste E2E exige o helper `parseEnvelope()` para extrair `body.data` — evitar ler `body.access_token` diretamente.
- Certifique-se de que `JWT_SECRET` está configurado corretamente no ambiente para que os tokens sejam assinados.

## Proximo foco
- Confirmar com o usuário a próxima task da Sprint 4: Task 10 (OpenAPI), Task 11 (e2e M2M), Task 3 (seed) ou Task 4 (matriz de permissões).

## Tasks concluidas na sessao
- Sprint 4 - Task 10: OpenAPI: token endpoint OAuth e erros RFC — Status `done`.

## Observacoes uteis para a proxima sessao
- Tratar `PRD.md` e `Sprints.md` como contratos.
- Os testes E2E do Nest+Fastify usam o `app.inject()` instanciado diretamente.
- O `ResponseEnvelopeInterceptor` embrulha TODAS as respostas. Acessar dados via `body.data`, não diretamente em `body`.
- Se o Swagger não refletir mudanças, matar o processo zumbi na porta 3000 e reiniciar `npm run dev`.
