# CONTEXT.md

> Memoria curta da ultima sessao. Atualize este arquivo no fechamento de cada sessao de trabalho.

## Referencias obrigatorias da sessao
- Fonte normativa principal (visao, escopo, arquitetura, regras): `PRD.md`
- Fonte oficial de backlog e priorizacao por sprint: `Sprints.md`

## Ultima acao realizada
- Sprint 5: concluída Task 3 — `Auditoria mínima de eventos críticos (§21)`. Criação do `AuditModule` e `AuditService` para logging estruturado em JSON e integração com os fluxos críticos de: Autenticação (sucesso, falha e refresh), Aplicações (regeneração de client_secret e mudança de status) e Usuários (mudança de status). Refatoração associada nos specs para suprir injeção da nova dependência.

## Arquivos modificados recentemente
- `src/modules/audit/audit.module.ts` e `src/modules/audit/audit.service.ts` — Módulo base.
- `src/server/app.module.ts` — Importação global do `AuditModule`.
- `src/modules/auth/auth.service.ts` / `src/modules/applications/applications.service.ts` / `src/modules/users/users.service.ts` — Injeção e emissão de eventos críticos.
- `docs/PRD_DEVELOPMENT.md` — Histórico atualizado.

## Estado atual
- Sprint 5 em andamento. Tasks 1, 2 e 3 concluídas.
- Observabilidade e logs de segurança e auditoria (estruturados) agora preenchem os requisitos operacionais §21.

## Pendencias e debitos
- Próximas tasks da Sprint 5: Healthcheck com dependências (Task 4) e Pipeline CI (Task 5).
- Testes E2E (como integração do Rate Limit em Redis) falham apenas por ausência de conectividade aos serviços em nível de máquina virtual (não é problema do código, mas falta o db de teste).

## Riscos e atencoes
- Atentar ao spin-up total do Docker Compose (PostgreSQL e Redis) antes de exigir verdades absolutas dos testes E2E localmente. 
- A auditoria não bloqueia transações se houver falha no logger (o que está aderente aos requisitos não bloqueantes).

## Proximo foco
- Sprint 5 - Task 4: Healthcheck com dependências (RF19, RNF09). Mostrar o status dos serviços acoplados (DB, Redis) na rota GET /v1/health.

## Tasks concluidas na sessao
- Sprint 5 - Task 3: Auditoria mínima de eventos críticos (§21).

## Observacoes uteis para a proxima sessao
- A suíte de testes unitários precisou de imports mock (`vi.fn()`) robustos para o `AuditService` para que os controllers e services isolados compilassem o e corressem em sucesso. Quando adicionar serviços globais no core, reatestar os injects nos Root Modules de teste sempre.
