# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 4: concluída task 9 — `Documentação pública de integração M2M (RFC 6749 + exemplos)`. Criado `docs/M2M_INTEGRATION_GUIDE.md`, corrigida nota desatualizada no `JWT_GUIDE.md` e atualizado `README.md` com tabela de endpoints completa da Sprint 4.

## Arquivos modificados recentemente
- `docs/M2M_INTEGRATION_GUIDE.md` — **Novo.** Guia público de integração M2M para parceiros externos com exemplos `curl`, escopos, erros OAuth e boas práticas.
- `docs/JWT_GUIDE.md` — Corrigida nota "ScopesGuard será implementado na Sprint 5" → já implementado na Sprint 4 Task 8. Adicionados links para `M2M_INTEGRATION_GUIDE.md` e `SCOPES_GUARD_TEST_GUIDE.md`.
- `README.md` — Tabela de endpoints atualizada para Sprint 4 (todas as rotas ✅). Tabela de documentação expandida com o novo guia M2M.
- `docs/PRD_DEVELOPMENT.md` — Task 9 marcada como concluída.

## Estado atual
- Tasks 1, 2, 5, 6, 7, 8 e 9 da Sprint 4 estão concluídas.
- Documentação pública de integração M2M disponível em `docs/M2M_INTEGRATION_GUIDE.md`.
- `README.md` reflete corretamente o estado atual do projeto (Sprint 4).

## Pendencias e debitos
- Tasks 3, 4, 10 e 11 da Sprint 4 ainda pendentes:
  - Task 3: Seed de papéis/permissões iniciais e teste e2e 403
  - Task 4: Mapear permissões por endpoint
  - Task 10: OpenAPI — completar Swagger com token endpoint OAuth e erros RFC
  - Task 11: Testes e2e M2M e spike manual com aplicação de teste

## Riscos e atencoes
- O padrão de teste E2E exige o helper `parseEnvelope()` para extrair `body.data` — evitar ler `body.access_token` diretamente.
- Certifique-se de que `JWT_SECRET` está configurado corretamente no ambiente para que os tokens sejam assinados.

## Proximo foco
- Confirmar com o usuário a próxima task da Sprint 4: Task 10 (OpenAPI), Task 11 (e2e M2M), Task 3 (seed) ou Task 4 (matriz de permissões).

## Tasks concluidas na sessao
- Sprint 4 - Task 7: Token M2M e OAuth token endpoint — Status `done`.
- Sprint 4 - Task 8: JWT Integration e ScopesGuard — Status `done`.
- Sprint 4 - Task 9: Documentação pública de integração M2M — Status `done`.

## Observacoes uteis para a proxima sessao
- Tratar `PRD.md` e `Sprints.md` como contratos.
- Os testes E2E do Nest+Fastify usam o `app.inject()` instanciado diretamente.
- O `ResponseEnvelopeInterceptor` embrulha TODAS as respostas. Acessar dados via `body.data`, não diretamente em `body`.
- Se o Swagger não refletir mudanças, matar o processo zumbi na porta 3000 e reiniciar `npm run dev`.
