# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 4: concluída task 11 — `Testes e2e M2M e spike manual com aplicação de teste`. Adicionada a aplicação semente no `prisma/seed.ts` e confirmados testes da integração M2M. A Sprint 4 está totalmente finalizada.

## Arquivos modificados recentemente
- `prisma/seed.ts` — Incluído código para gerar a "Test Application" (`test-client-id` / `test-client-secret`) e o escopo `test:scope` na inicialização do banco.
- `test/integration.e2e.spec.ts` — Confirmada integridade estrutural e adoção do `parseEnvelope` nas asserções.
- `docs/M2M_INTEGRATION_GUIDE.md` — Guia público de integração M2M para parceiros externos com exemplos `curl`, escopos, erros OAuth e boas práticas.

## Estado atual
- Tasks 1 a 11 da Sprint 4 estão concluídas. O ciclo está pronto para encerramento ou migração para a Sprint 5.

## Pendencias e debitos
- Sem pendências críticas. A base OAuth 2.0 (client credentials) e autorização RBAC está implementada e testada.

## Riscos e atencoes
- O padrão de teste E2E exige o helper `parseEnvelope()` para extrair `body.data` — evitar ler `body.access_token` diretamente.
- Certifique-se de que `JWT_SECRET` está configurado corretamente no ambiente para que os tokens sejam assinados.

## Proximo foco
- Iniciar o escopo da **Sprint 5**, priorizando segurança operacional com Rate limit e lockout (Task 1).

## Tasks concluidas na sessao
- Sprint 4 - Task 11: Testes e2e M2M e spike manual com aplicação de teste — Status `done`.

## Observacoes uteis para a proxima sessao
- Tratar `PRD.md` e `Sprints.md` como contratos.
- Os testes E2E do Nest+Fastify usam o `app.inject()` instanciado diretamente.
- O `ResponseEnvelopeInterceptor` embrulha TODAS as respostas. Acessar dados via `body.data`, não diretamente em `body`.
- Se o Swagger não refletir mudanças, matar o processo zumbi na porta 3000 e reiniciar `npm run dev`.
