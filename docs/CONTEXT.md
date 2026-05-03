# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 5: iniciada e concluída Task 1 — `Rate limit e lockout (RNF07)`. Implementada proteção contra brute-force no login utilizando Redis, `RateLimiterRedis`, `RateLimitGuard` e `LoginStatusInterceptor`.

## Arquivos modificados recentemente
- `src/server/common/rate-limit/` — Novo componente de proteção contra abuso.
- `src/modules/auth/auth.controller.ts` — Aplicada proteção de rate limit no endpoint de login.
- `src/modules/auth/auth.module.ts` — Integrado `RateLimitModule`.
- `test/rate-limit.e2e.spec.ts` — Novos testes E2E validando 5 req/min e lockout de 30 min.
- `.env` e `.env.example` — Adicionadas configurações de rate limit e Redis.

## Estado atual
- Sprint 4 finalizada.
- Sprint 5 iniciada com sucesso (Task 1 concluída).
- Sistema de proteção contra brute-force operacional e testado.

## Pendencias e debitos
- Próximas tasks da Sprint 5: Logs estruturados (Task 2) e Auditoria (Task 3).

## Riscos e atencoes
- O sistema depende do Redis estar online para aplicar o rate limit.
- O lockout de 30 minutos é aplicado tanto por IP quanto por E-mail após 5 falhas consecutivas.

## Proximo foco
- Sprint 5 - Task 2: Logs estruturados JSON com requestId (RNF11).

## Tasks concluidas na sessao
- Sprint 5 - Task 1: Rate limit e lockout (RNF07).

## Observacoes uteis para a proxima sessao
- O helper `RateLimitGuard` extrai o e-mail do `body.email`. Certifique-se de que novos endpoints sensíveis sigam esse padrão ou ajuste o guard.
- O `LoginStatusInterceptor` reporta falha apenas se receber `AUTH_INVALID_CREDENTIALS`.
