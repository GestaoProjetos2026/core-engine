# PRD de Desenvolvimento - Erp Core Auth

Este documento serve como tracking contínuo de desenvolvimento, mapeando e centralizando o progresso do projeto. Ele contém o registro de tudo o que foi desenvolvido (Tasks e Sprints concluídas), dificuldades técnicas encontradas, tasks postergadas e todas as implementações ou decisões de arquitetura no código. 

Este arquivo deve ser atualizado sistematicamente ao fim de cada nova feature, task ou sprint.

---

## 🎯 Sprints e Tasks Concluídas

### Sprint 1: Planejamento e MVP do Banco de Dados
**Status**: ✔️ Concluída
- **Task 1**: Elaboração do PRD do Core/Auth.
- **Task 2**: Definição e abstração do MVP do banco de dados.
- **Tasks 3, 4, 5, 6**: Modelagem das entidades principais: `User`, `Role`, `Permission`, além de suas tabelas de relacionamento para suporte a RBAC.
- **Task 7**: Configuração de infraestrutura inicial e variáveis de ambiente base (`.env` e `.env.example`).
- **Task 8**: Padronização do versionamento da API com o prefixo global `/v1`.

### Sprint 2: Fundação API e Infraestrutura
**Status**: ✔️ Concluída
- **Task 1**: Bootstrap da aplicação base, configurando o NestJS, módulo global do Prisma e rotas de estado (Ex: `/v1/health`).
- **Task 2**: Implementação do envelope padrão de resposta (success, data, timestamps) e captura hierárquica de erro com `error.code`.
- **Task 3**: Entrega da documentação inicial sobre o contrato da API e dos catálogos de erro.
- **Task 4**: Configuração do Swagger/OpenAPI em `/v1/docs`.
- **Task 5**: Oramentação de containers via Docker Compose (PostgreSQL e App) para padronizar cenários de desenvolvimento locais.
- **Task 6**: Evolução do Prisma Schema contendo RefreshToken, Application, Scope e migrações fundamentais para as lógicas de auth e client.

### Sprint 3: Core Auth, JWT, Guards e Interceptadores
**Status**: ✔️ Concluída
- **Task 1**: Implementação dos endpoints primários (`POST /v1/auth/register` e `POST /v1/auth/login`) contendo lógicas de credenciais.
- **Task 2**: Implementação mecânica do endpoint de refresh token (`POST /v1/auth/refresh`) com rotação obrigatória de chaves.
- **Task 3**: Conclusão da rota `GET /v1/auth/me` para retorno do profile persistente, papéis e permissões do usuário em contexto.
- **Task 4**: Arquitetura da emissão de tokens JWT access e construção de estratégias limpas em dependências através do Guard (`JwtAuthGuard`).
- **Task 5**: Publicação de documentação orientando integradores internos como consumir perfis e validar acessos localmente via JWT payload.
- **Task 6**: Geração de estrutura de testes integrados/e2e validando login, refresh token, e o endpoint `/me`.
- **Task 7**: Spike de RBAC para testagem manual.
- **Task 8**: Desenvolvimento do Core do RBAC - `PermissionsGuard` em alinhado com decorador para exigir acessos explícitos `@RequirePermissions(...)`.
- **Task 9**: CRUD Administrativo de `/v1/users` validando proteção, status e paginações.

---

## 🚀 Sprints em Andamento / Próximas

### Sprint 4: RBAC Completo e Integrações Restritivas
**Status**: ✔️ Concluída
- **Task 1**: Criação e manutenção do CRUD de Papéis e de Permissões. ✔️ (Concluído em 22/04/2026)
- **Task 2**: Gerenciamento de vínculos relacionais fortes M2M (Usuário-Papel e Papel-Permissão). ✔️ (Concluído em 22/04/2026)
- **Task 3**: Seed de papéis/permissões iniciais e testes e2e de autorização (403). ✔️ (Concluído em 24/04/2026)
- **Task 4**: Matriz de permissões por endpoint publicada e versionada no repositório. ✔️ (Concluído em 24/04/2026)
- **Task 5**: CRUD de aplicações e regeneração de secret (RF14, RF15). ✔️ (Concluído em 23/04/2026)
- **Task 6**: Catálogo de escopos e vínculo aplicação–escopo (RF16). ✔️ (Concluído em 23/04/2026)
- **Task 7**: Token M2M e OAuth token endpoint (RF17, RF21, RF22, RF23). ✔️ (Concluído em 24/04/2026)
- **Task 8**: JWT Integration e ScopesGuard (RF18, CA07). ✔️ (Concluído em 24/04/2026)
- **Task 9**: Documentação pública de integração M2M (RFC 6749 + exemplos). ✔️ (Concluído em 24/04/2026)
- **Task 10**: OpenAPI: token endpoint OAuth e erros alinhados à RFC (RF20). ✔️ (Concluído em 24/04/2026)
- **Task 11**: Testes e2e M2M e spike manual com aplicação de teste. ✔️ (Concluído em 24/04/2026)

### Sprint 5: Segurança Operacional e Finalização
**Status**: ✔️ Concluída
- **Task 1**: Implementação de Rate Limit e Lockout (RNF07) utilizando Redis e custom Guards/Interceptors. ✔️ (Concluído em 03/05/2026)
- **Task 2**: Implementação de Logs estruturados JSON e `requestId` (RNF11) utilizando `nestjs-pino` e Fastify hooks. ✔️ (Concluído em 03/05/2026)
- **Task 3**: Auditoria mínima de eventos críticos (§21) utilizando logs estruturados e injetados globalmente via `AuditService`. ✔️ (Concluído em 03/05/2026)
- **Task 4**: Healthcheck com dependências (RF19, RNF09). Utilização nativa do PrismaService e ioredis validando liveness das comunicações sem dependências externas como `@nestjs/terminus`. ✔️ (Concluído em 03/05/2026)
- **Task 7**: Implementação de cabeçalhos de segurança HTTP e Content Security Policy (CSP) com `@fastify/helmet` por ambiente. ✔️ (Concluído em 06/05/2026)
- **Task 8**: README e exemplos públicos, contendo fluxos cURL testados para fluxos Humanos e M2M, além de atualização do DoD da sprint. ✔️ (Concluído em 06/05/2026)
- **Task 9**: Seed final de papéis e matriz de `permission.code` (P1). Consolidação de códigos estáveis, inclusão de permissões de domínios para squads consumidores e criação do documento normativo de matriz de acesso. ✔️ (Concluído em 07/05/2026)
- **Task 10**: Revisão de DoD e encerramento MVP (§23). ✔️ (Concluído em 08/05/2026)
- **Tasks 5 e 6**: Marcadas `done` no backlog; CI de deploy por tag (`deploy.yaml`) e cobertura tratadas no ecossistema (Squad 5).

### Sprint 6: Frontend Administrativo
**Status**: ✔️ Concluída
- **Task 1**: Setup do Projeto Frontend (React + Vite + TS). ✔️ (Concluído em 12/05/2026)
- **Task 2**: Fluxo de Autenticação e Proteção de Rotas. ✔️ (Concluído em 12/05/2026)
- **Task 3**: Dashboard e Perfil do Usuário. ✔️ (Concluído — `DashboardPage` e `ProfilePage` no repositório.)
- **Task 4**: Gerenciamento de Usuários (CRUD) — listagem com busca (`email`), paginação (`page`/`limit`), filtro de status, modais de criação (`POST /v1/users`) e edição (`PATCH /v1/users/:id`), alteração de status (`PATCH /v1/users/:id/status`), tipo `AdminUserListItem` em `Frontend/src/lib/types.ts`. ✔️ (Concluído em 14/05/2026)
- **Task 5**: Gestão de Papéis e Permissões (RBAC) — UI N:N de vínculos e CRUD via `RolesPage.tsx`. Modificações extensivas no backend para prover suporte completo à listagem e operações `DELETE` das regras. ✔️ (Concluído em 14/05/2026)
- **Task 6**: Gestão de Aplicações M2M — `ApplicationsPage.tsx` com CRUD (`POST/PATCH /v1/applications`, status, regeneração de secret), modal one-time para `client_secret` (RN02), gestão de escopos via multiselect (`GET /v1/scopes`, `GET/POST /v1/applications/:id/scopes`). Tipos `ApplicationListItem`, `ApplicationWithSecret`, `Scope` em `Frontend/src/lib/types.ts`. ✔️ (Concluído em 15/05/2026)

**Incidente / ambiente (sessão 14/05/2026):** `npm run build` no `Frontend` falhou localmente sem `node_modules` (módulos TypeScript não resolvidos). Resolvido com `npm install` seguido de `npm run build` (sucesso).

**Nota técnica (Task 6):** `GET /v1/applications` não retorna escopos embutidos; a UI busca escopos por aplicação em paralelo ao renderizar a listagem da página atual.

---

### Sprint 8: Entrega integrada (ADR-001 + Alicerce CTO) — 23/05 a 29/05/2026
**Status**: 🚀 Em andamento (tasks 1–9 concluídas; tasks 10–17 pendentes)
- **Task 1**: Tokens CSS globais em `frontend/src/index.css` (primitivas, semânticas, tipografia, espaçamento, radius, sombras, aliases legados, `:focus-visible`). ✔️ (Commit [#512] CORECOREEN-75)
- **Task 2**: AppShell — `Layout.tsx` / `Layout.css` (sidebar 240px, item ativo brand, topbar 56px). ✔️ (Commit [#513] CORECOREEN-76)
- **Task 3**: Componentes UI — `Button`, `Input`, `Card`, `Badge`, `Table` alinhados ao ADR-001. ✔️ (Commit [#514] CORECOREEN-77)
- **Task 4**: Páginas CRUD — `UsersPage`, `RolesPage`, `ApplicationsPage` + `AdminPages.css` (modais elevados, sem estilos inline legados). ✔️ (Commit [#515] CORECOREEN-78)
- **Task 5**: Auth e Dashboard — `LoginPage.css`, `RegisterPage`, `ProfilePage.css`, `DashboardPage` (metric cards overline/28px), `PrivateRoute` loading ADR. ✔️ (Commit [#516] CORECOREEN-79)
- **Task 6**: `ToastProvider` + `Toast.css` (§9.8), `PageLoading`, toasts em CRUD/auth, remoção de `alert()`. ✔️ (Commit [#517] CORECOREEN-80)
- **Tasks 7–9**: Bug bash UI/UX, auditoria de segurança/performance e encerramento do escopo frontend — ✔️ concluídas.

**Pendente (tasks 10–17 — Alicerce CTO):**
- **Task 10**: Role `suporte` + usuário demo.
- **Task 11**: `GET /v1/integration/users/:id` (M2M; distinto de `GET /v1/users/:id` para humano).
- **Tasks 12–13**: Multi-tenant (`Tenant`, `tenant_id` no JWT, `X-Tenant-Id`).
- **Task 14**: Gateway multi-módulo + `docs/GATEWAY.md`.
- **Task 15**: Seed apps M2M por squad.
- **Task 16**: `docs/DEMO_CTO.md`.
- **Task 17**: Demo CTO 29/05/2026.

**Arquivos-chave (tasks 1–9):** `docs/PadraoFront/Padronizacao.md`, `frontend/src/pages/AdminPages.css`, `frontend/src/context/ToastContext.tsx`, `frontend/src/components/ui/PageLoading.tsx`.

**Build:** `npm run build` no diretório `frontend/` validado ao longo das tasks 1–9.

---

### Sprint 7: Integração e Documentação para Squads Consumidores
**Status**: ✔️ Concluída
- **Task 1**: Guia de Integração para Outros Módulos. ✔️ (Concluído em 21/05/2026) — `docs/INTEGRATION_GUIDE.md`.
- **Task 2**: SDK/Snippet de Validação de Token. ✔️ (Concluído — `backend/src/shared/utils/token.ts` e documentação).
- **Task 3**: Workshop de Homologação com squads consumidores. ✔️ (Concluído).

---

### Sessão 27/05/2026 — Sprint 8 task 11 (API identidade M2M)

- **`GET /v1/integration/users/:id`:** `IntegrationTokenGuard` + `ScopesGuard` + escopo `identity:read`; rejeita token humano.
- **Seed:** escopo `identity:read` no catálogo M2M.
- **Docs:** `INTEGRATION_GUIDE.md` §4.6, `PERMISSIONS_MATRIX.md`.
- **Testes:** `integration.e2e.spec.ts` (200/403/404), `integration-token.guard.spec.ts`.

### Sessão 27/05/2026 — Sprint 8 task 10 (RBAC suporte)

- **`backend/prisma/seed.ts`:** papel `suporte` com permissões operacionais (`customers:read`, `tickets:*`, `dashboard:read`, `health:read`); catálogo `finance:read` / `finance:write` para Squad 2 **sem** vínculo ao `suporte`; usuário demo `suporte@example.com` / `Suporte123!`; validação no seed que `suporte` não recebe `finance:*` nem `orders:*`.
- **`docs/PERMISSIONS_MATRIX.md`:** documentação do papel, permissões fiscais e credenciais de demo.
- **`auth.service.spec.ts`:** teste garantindo JWT de login `suporte` sem `finance:*` no payload.

### Sessão 27/05/2026 — Planejamento e normativo (PRD v2.1)

- **`PRD.md` v2.1:** amendamento para alinhar checklist CTO e Sprint 8 — multi-tenant lógico (RF25–RF27), identidade M2M (RF29), gateway (RF28), papel `suporte` (RF30), §5.7–5.8, CA10–CA14, modelo `Tenant`, claims `tenant_id`, §14.7 gateway.
- **`Sprints/Sprints.md`:** Sprint 8 estendida até 29/05; tasks 10–17; Sprint 9 fundida na 8; Sprints 5–7 encerradas.
- **Decisão:** manter task 11 como endpoint M2M dedicado; `GET /v1/users/:id` permanece para RBAC humano (`users:read`).
- **RNF08:** política de senha considerada implementada (backend + formulário admin).

---

## 🏗️ Débitos Técnicos e Próximos Passos (Pós-MVP)

1. **Sprint 8 tasks 10–17:** implementação do Alicerce (código ainda não reflete PRD v2.1).
2. **PRD v2.1 vs código:** alinhado em tasks 12–14 (`Tenant`, identidade M2M, `X-Tenant-Id`, `docs/GATEWAY.md`).
3. **Migração para Node.js LTS:** Node 25 em Windows apresentou instabilidades; preferir Node 22 (LTS) em produção.
4. **`docs/JWT_GUIDE.md`:** atualizar exemplo de claims com `tenant_id` após implementação da task 12.


---

## 🛠️ Alterações, Modificações e Implementações Técnicas


Durante o desenvolvimento das Sprints 1 a 4, diversas tomadas de decisão cruciais e refatorações se mostraram necessárias:

- **Implementação do RolesModule e PermissionsModule**: Criação de controladores, serviços e DTOs para gestão de RBAC.
- **Segurança de Rotas**: Proteção dos novos endpoints com `JwtAuthGuard` e `PermissionsGuard` utilizando o decorador `@RequirePermissions`.
- **Estabilização do Dashboard (Sprint 05)**:
    - **Hardening de Serviços**: Implementação de capturas de erro granulares no `DashboardService`, permitindo que o sistema exiba dados parciais mesmo se o Redis ou o Banco de Dados estiverem temporariamente degradados.
    - **Correção de Serialização JSON**: Conversão explícita de contagens do Prisma para `Number`, resolvendo erros de serialização que causavam falhas 500 silenciosas.
    - **Gestão de Ambiente Local**: Resolução de conflitos de porta (`EADDRINUSE`) e sincronização de roteamento global (`/v1/dashboard`) entre Frontend e Backend.
- **Workaround de Swagger**: Remoção temporária da propriedade `type` nos decoradores `@ApiResponse` dos novos módulos para mitigar um erro crítico de "Circular Dependency" no motor do Swagger/Fastify no ambiente de desenvolvimento Node 25.
- **Sprint 6 — UI de usuários (RF09 no admin)**: Listagem via `GET /v1/users`; validação de senha no admin e backend alinhadas ao **RNF08**.
- **Sessão 27/05/2026 — PRD v2.1**: escopo normativo ampliado para entrega integrada CTO; implementação segue backlog Sprint 8 tasks 10–17.
- **Sprint 6 — UI de aplicações M2M (RF14–RF16)**: CRUD e regeneração de secret no admin; exibição única do `client_secret` com confirmação explícita do operador; associação de escopos substitui vínculos existentes (`POST /v1/applications/:id/scopes` com `scopeIds`).
- **Sprint 8 — Migração ADR-001 (frontend/)**: Substituição da paleta legada (cinza/pêssego) por tokens azul profundo (`#001233`, brand `#0466c8`). Estratégia de aliases CSS legados em `index.css` para migração incremental. `AdminPages.css` centraliza layout admin (filtros, modais, paginação, tabs). Feedback global via `ToastProvider` e `PageLoading` substituindo `alert()` e textos “Loading…” soltos.

---

## ⚠️ Dificuldades Encontradas e Soluções Adotadas

1. **Dependência Circular em Parsers do OpenAPI (@nestjs/swagger)**
   - **Problema**: Ocorreram conflitos em processamento de metadata de DTOs durante a startup do Nest, gerando erros de `Circular dependency detected` no motor do Swagger, impedindo o boot da aplicação ou ocultando campos de Request Body (especialmente no `LoginDto`).
   - **Solução Contornada**: Utilização de definições de esquema inline (`@ApiBody({ schema: { ... } })`) para contornar a inferência automática baseada em classes em endpoints críticos, e aplicação de `lazy resolvers` (`() => Class`) onde possível.

   
2. **Inicialização Instável do Prisma Client e Seed**
   - **Problema**: Dificuldade em inicializar corretamente as engines e transações (`PrismaClientInitializationError`) no ato de boot e seeds em persistência de desenvolvimento.
   - **Solução Contornada**: Compatibilização com variáveis de ambiente configuradas, garantia de execução do daemon do postgres através do docker, e ajuste fino da conexão em `prisma.service.ts`.

3. **Instabilidade de Injeção de Dependência (DI) em Ambiente TSX**
   - **Problema**: Falhas na resolução automática de dependências pelo NestJS em tempo de execução (especialmente ao usar `tsx watch`), resultando em injeções nulas (`undefined`) em construtores de controllers e services. Isso causava erros genéricos de `INTERNAL_ERROR`.
   - **Solução**: Adoção de injeção explícita com o decorador `@Inject()` em todos os construtores de módulos do Core Engine, garantindo a estabilidade da DI independente da ordem de carregamento dos arquivos.

4. **Crash Nativo do Node.js (uv_loop) em Prisma db push (Windows)**
   - **Problema**: Com Node.js v25 em ambiente Windows, a execução do `prisma db push` falhava subitamente com \`Assertion failed\` via chamadas nativas em C (`src\\win\\async.c`). Esse bloqueio impediu a sincronização da tabela `applications` (P2021) durante a construção de E2E tests reais que batiam no DB.
   - **Solução**: Para testar a funcionalidade API completa End-to-End, contornamos usando vitest override com `overrideProvider(PrismaService).useValue(...)`, blindando nossos E2Es frente a instabilidades sistêmicas e testando precisamente Rest Controllers.

5. **Bloqueio de Metadados do Swagger por Cache do Processo Zumbi (`tsx watch`)**
   - **Problema**: Mesmo após adicionar manualmente os decoradores `@ApiParam` e `@ApiQuery` em todos os controladores, o Swagger UI continuava exibindo "No parameters". Identificamos que após o erro anterior de "Circular Dependency", o processo filho do `tsx watch` no Windows prendeu a porta 3000 (`EADDRINUSE` silencioso) e travou a re-avaliação da AST de metadados no re-load, ignorando sumariamente novos decoradores de parâmetro nas rotas.
   - **Solução**: Localização e finalização forçada do processo zumbi na porta 3000 via PowerShell (`Stop-Process`), seguido de um reinício totalmente limpo do ambiente de desenvolvimento (`npm run dev`). Isso forçou a varredura correta dos esquemas e restaurou a injeção dos parâmetros.

6. **Permissões Críticas Ausentes no Banco (Bloqueio de Testes)**
   - **Problema**: Durante a validação manual dos novos endpoints (como `POST /v1/applications/:id/scopes`), as rotas retornavam `403 Forbidden` mesmo para usuários administrativos, pois as permissões primordiais (`applications:read/write`, `scopes:read/write`) não haviam sido catalogadas e associadas ao papel `Admin` durante o seed do Prisma.
   - **Solução**: Atualização profunda da matriz de permissões no `prisma/seed.ts` e execução do comando de re-seed, o que liberou integralmente os testes end-to-end via Swagger.

7. **Dependência Circular Reincidente no Swagger (Módulo Integration)**
   - **Problema**: Ao introduzir o `IntegrationModule` e seus DTOs (`OAuthTokenRequestDto`, `OAuthTokenResponseDto`), o motor do Swagger disparou novamente o erro de `circular dependency detected` para a propriedade `client_id`, mesmo sem relações bidirecionais evidentes.
   - **Solução**: Seguindo o padrão estabelecido anteriormente, removemos os decoradores `@ApiProperty` dos DTOs de integração e aplicamos esquemas inline (`schema: { ... }`) nos decoradores `@ApiBody` e `@ApiResponse` do `IntegrationController`. Isso estabilizou o boot da aplicação e permitiu a exibição correta dos endpoints no Swagger UI.

8. **Interceptor de Envelope Quebrava Asserções de Token nos Testes E2E**
   - **Problema**: Com a adição do `ResponseEnvelopeInterceptor` ao setup dos testes E2E, todos os retornos passaram a ser embrulhados em `{ success, data, ... }`. Os testes de token que liam `body.access_token` passaram a receber `undefined`, pois o token agora está em `body.data.access_token`.
   - **Solução**: Refatoração do arquivo `integration.e2e.spec.ts` para usar um helper `parseEnvelope(payload)` que extrai `body.data` corretamente. O padrão foi documentado com comentário no topo do arquivo de testes para evitar reincidências.

9. **Referência Desatualizada ao `ScopesGuard` no `JWT_GUIDE.md`**
   - **Problema**: O `JWT_GUIDE.md` indicava que `ScopesGuard` seria implementado na "Sprint 5", quando na realidade foi entregue na Sprint 4 Task 8.
   - **Solução**: Correção da nota e atualização das referências cruzadas, incluindo link para `docs/M2M_INTEGRATION_GUIDE.md` e `docs/SCOPES_GUARD_TEST_GUIDE.md`.
10. **DI Omissa nos Testes (Esbuild TypeScript Compiler)**
    - **Problema**: O `HealthController` injetava o `HealthService` nativamente via inferência de TypeScript, mas durante execução no esbuild (vitest e tsx engine) as dependências não resolviam o inject corretamente, lançando `Cannot read properties of undefined (reading 'checkDatabase')`.
    - **Solução**: Uso imperativo do `@Inject(HealthService)` nos construtores do Health Module, conforme estabelecido no problema prévio catalogado nas Sprints 1 a 4.

11. **Soft Degradation no Healthcheck**
    - **Problema**: A dependência e falhas drásticas na comunicação com o banco (`Prisma`) ou o (`Redis`) jogaria exceções 500 mascaradas pelo EnvelopeInterceptor, confundindo orquestradores como Kubernetes.
    - **Solução**: O serviço isola a exceção e retorna HTTP 200 encapsulado com `{ status: 'degraded' }`, satisfazendo as políticas orquestrais que leem o corpo de liveness sem acionar o panic mode dos frameworks.

---

## 📝 Tasks Postergadas
- **Multi-tenant avançado** (admin cross-tenant, billing): fora do MVP v2.1 — roadmap §25 PRD.
- **OIDC completo, MFA:** permanecem fora do escopo conforme PRD §6 e §27.
