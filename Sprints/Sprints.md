Sprint 1 — 13/03/2026 a 20/03/2026

1) PRD do Core/Auth
Status: done


Pertence a: Planejamento inicial do produto
Título: Criar PRD do Core/Auth
Descrição: Documentar objetivo do produto, escopo inicial, módulos, premissas, dependências, fluxos principais de autenticação/autorização e visão de MVP.
Critérios de aceitação:

- escopo do Core/Auth documentado
- objetivos e não objetivos definidos
- fluxos principais descritos
- módulos e entregas priorizados
Prioridade: Urgent
Estimativa: 3 SP
Label: prd, planning, core-auth, sprint-1

2) MVP do banco de dados
Status: done


Pertence a: Module 5 — Banco de Dados
Título: Criar MVP do banco de dados
Descrição: Definir a primeira versão funcional da base relacional do Core/Auth, suficiente para suportar autenticação, usuários, papéis e permissões.
Critérios de aceitação:

- modelagem inicial definida
- entidades principais identificadas
- relações mínimas mapeadas
- pronto para virar schema Prisma
Prioridade: Urgent
Estimativa: 5 SP
Label: database, mvp, prisma, core-auth, sprint-1

3) Modelar entidade User
Status: done


Pertence a: Module 5 — Banco de Dados / Issue: Definir modelo de dados do Core/Auth
Título: Modelar entidade User
Descrição: Definir campos, regras e atributos da tabela de usuários.
Critérios de aceitação:

- estrutura aprovada pelo squad
- contempla nome, e-mail, senha hash, status e timestamps
Prioridade: Urgent
Estimativa: 1 SP
Label: database, user, modeling, sprint-1

4) Modelar entidade Role
Status: done


Pertence a: Module 5 — Banco de Dados / Issue: Definir modelo de dados do Core/Auth
Título: Modelar entidade Role
Descrição: Definir estrutura da tabela de papéis.
Critérios de aceitação:

- estrutura aprovada
- suporta administração de acesso
Prioridade: High
Estimativa: 1 SP
Label: database, role, modeling, sprint-1

5) Modelar entidade Permission
Status: done


Pertence a: Module 5 — Banco de Dados / Issue: Definir modelo de dados do Core/Auth
Título: Modelar entidade Permission
Descrição: Definir estrutura da tabela de permissões com código e descrição.
Critérios de aceitação:

- estrutura aprovada
- preparada para RBAC
Prioridade: High
Estimativa: 1 SP
Label: database, permission, modeling, sprint-1

6) Modelar tabelas de relacionamento
Status: done


Pertence a: Module 5 — Banco de Dados / Issue: Definir modelo de dados do Core/Auth
Título: Modelar tabelas de relacionamento
Descrição: Definir user_roles e role_permissions com regras de integridade.
Critérios de aceitação:

- relacionamentos aprovados
- cardinalidades corretas
- duplicidade controlável por constraint
Prioridade: High
Estimativa: 2 SP
Label: database, relations, rbac, sprint-1

7) Configurar .env e .env.example
Status: done


Pertence a: Module 7 — Infraestrutura e Documentação / Issue: Configurar estrutura base do projeto
Título: Configurar .env e .env.example
Descrição: Estruturar variáveis de ambiente do backend e do banco.
Critérios de aceitação:

- arquivo example criado
- variáveis mínimas documentadas
- projeto consegue subir com configuração padrão
Prioridade: High
Estimativa: 1 SP
Label: infra, env, setup, sprint-1

8) Definir prefixo global /v1
Status: done


Pertence a: Module 6 — APIs / Issue: Padronizar estrutura das APIs
Título: Definir prefixo global /v1
Descrição: Versionar a API desde o início para evitar retrabalho futuro.
Critérios de aceitação:

- todas as rotas base preparadas para usar /v1
Prioridade: High
Estimativa: 1 SP
Label: api, versioning, v1, sprint-1

Resumo da ordem de execução
Sprint 1
PRD + MVP do banco + setup inicial

---

Notas de calendário (sprints semanais: sábado a sexta-feira)

- **Sprint 2** é semana curta (6 dias) até o início da Sprint 3 em 28/03.
- **Sprint 3 (estendida):** 28/03/2026 a 17/04/2026 — janela maior para fundação de auth, documentação de contrato e primeiros fluxos testáveis.
- **Sprint 4:** 18/04/2026 a 24/04/2026 — une RBAC completo, integração M2M, OAuth token endpoint e escopos; documentação para integradores.
- **Sprint 5 (finalização):** 25/04/2026 a 08/05/2026 — Segurança operacional, observabilidade, CI/CD, hardening e encerramento do MVP.
- **Sprint 6 (Frontend):** 09/05/2026 a 15/05/2026 — Desenvolvimento completo da interface administrativa (Módulo 08).
- **Sprint 7 (Integração):** 16/05/2026 a 22/05/2026 — Guia de integração para outros módulos e squads.
- **Sprint 8 (Entrega integrada):** 23/05/2026 a 29/05/2026 — Migração ADR-001 no admin (tasks 1–9 concluídas) + Alicerce para squads consumidoras: papel `suporte`, multi-tenant, gateway multi-módulo e demo do checklist técnico (tasks 10–17).

---

Sprint 2 — 22/03/2026 a 27/03/2026

1) Bootstrap NestJS e módulos base (Common, Health)
Status: done


Pertence a: Module 6 — APIs / Infraestrutura
Título: Subir aplicação NestJS com prefixo global /v1
Descrição: Criar projeto NestJS modular, configurar Prisma como módulo global, expor `GET /v1/health` e garantir que todas as rotas públicas sigam o prefixo `/v1`.
Critérios de aceitação:

- API Nest inicia sem erros
- rota `GET /v1/health` retorna payload de sucesso no envelope padrão
- prefixo global `/v1` aplicado à configuração
Prioridade: Urgent
Estimativa: 5 SP
Label: nestjs, bootstrap, health, sprint-2

2) Envelope de resposta e filtro de erros com error.code
Status: done


Pertence a: Module 6 — APIs / Common
Título: Padronizar sucesso e erro (§18 e §19 do PRD)
Descrição: Implementar interceptor ou filtro para envelope `success`, `data`, `timestamp`, `path` e erros com `error.code` alinhados ao catálogo inicial do PRD (incl. `VALIDATION_ERROR`, `INTERNAL_ERROR`).
Critérios de aceitação:

- respostas de sucesso seguem o envelope acordado
- erros retornam `error.code` e HTTP status coerentes
- exceções não vazam stack em produção
Prioridade: Urgent
Estimativa: 3 SP
Label: api, errors, envelope, sprint-2

3) Documentação inicial de contrato e catálogo de erros (consumo externo)
Status: done


Pertence a: Module 7 — Infraestrutura e Documentação
Título: Publicar guia de integração e catálogo error.code
Descrição: Criar documento no repositório (ex.: `docs/` ou README seção) descrevendo envelope JSON, `meta.requestId` quando existir, e tabela inicial de `error.code` + HTTP status para outros módulos do ERP e squads.
Critérios de aceitação:

- documento versionado no repo
- lista de códigos alinhada ao PRD §19.1
- referência cruzada com Swagger quando disponível
Prioridade: Urgent
Estimativa: 2 SP
Label: docs, errors, integration, sprint-2

4) Swagger/OpenAPI 3 configurado e convencionado
Status: done


Pertence a: Module 6 — APIs
Título: Configurar Swagger em `/v1/docs` (ou convenção equivalente)
Descrição: Habilitar Swagger UI com tags, descrição da API Core/Auth e exemplos de resposta de erro; documentar segurança Bearer para rotas futuras.
Critérios de aceitação:

- documentação acessível em ambiente de desenvolvimento
- descrição da API e tags presentes
- exemplo de erro 400/401 documentado
Prioridade: High
Estimativa: 3 SP
Label: openapi, swagger, sprint-2

5) Docker Compose e variáveis para desenvolvimento
Status: done


Pertence a: Module 7 — Infraestrutura
Título: Orquestrar app + PostgreSQL para desenvolvimento
Descrição: Garantir `docker-compose` (ou equivalente) para subir API + banco, alinhado a `.env.example` já existente.
Critérios de aceitação:

- compose sobe Postgres e app com um comando documentado
- variáveis necessárias listadas no example
- README com instrução mínima
Prioridade: High
Estimativa: 3 SP
Label: docker, infra, sprint-2

6) Alinhar schema Prisma ao modelo alvo do PRD (migração)
Status: done


Pertence a: Module 5 — Banco de Dados
Título: Evoluir schema para RefreshToken, Application, Scope e Permission semântica
Descrição: Ajustar modelo conforme PRD (ex.: refresh com rotação, tokens de integração, `permission.code` ou equivalente único, status de usuário/aplicação); planejar migrações sem perda desnecessária de dados em dev.
Critérios de aceitação:

- schema Prisma reflete entidades necessárias ao MVP
- migração aplicável em ambiente limpo
- decisões documentadas se houver desvio pontual
Prioridade: Urgent
Estimativa: 5 SP
Label: prisma, migration, database, sprint-2

Resumo Sprint 2
Fundação API + documentação de contrato e erros + Docker + alinhamento de dados

---

Sprint 3 (estendida) — 28/03/2026 a 17/04/2026

1) Registro e login e-mail/senha (RF01, RF02, RF03)
Status: done


Pertence a: Module 1 — Auth
Título: Implementar `POST /v1/auth/register` e `POST /v1/auth/login`
Descrição: Hash de senha com Argon2id (ou Bcrypt conforme RNF08), validação de política de senha, usuário inativo não autentica (RN01); respostas no envelope padrão.
Critérios de aceitação:

- registro com e-mail único retorna 409 em duplicidade (RN06)
- login com credenciais válidas retorna access e refresh
- login falho não vaza se e-mail existe
Prioridade: Urgent
Estimativa: 8 SP
Label: auth, register, login, sprint-3

2) Refresh token com rotação obrigatória (RF04, RN03)
Status: done


Pertence a: Module 1 — Auth
Título: Implementar `POST /v1/auth/refresh`
Descrição: Persistir refresh com hash, revogar e substituir em uso; reuso de refresh antigo falha com 401 e código claro (CA04).
Critérios de aceitação:

- refresh válido gera novo par access/refresh
- refresh antigo invalidado
- tentativa de reuso retorna erro de segurança documentado
Prioridade: Urgent
Estimativa: 5 SP
Label: auth, refresh, rotation, sprint-3

3) Endpoint `GET /v1/auth/me` (RF08)
Status: done


Pertence a: Module 1 — Auth
Título: Implementar perfil e autorizações efetivas (papéis/permissões)
Descrição: Com Bearer access token de usuário, retornar dados do usuário e lista de roles/perms conforme modelo JWT do PRD §16.1.
Critérios de aceitação:

- token válido retorna dados coerentes
- token inválido/expirado retorna 401 com código adequado
- resposta documentada no Swagger
Prioridade: Urgent
Estimativa: 3 SP
Label: auth, me, jwt, sprint-3

4) Emissão JWT access (HS256, RNF03/RNF04) e estratégia Passport
Status: done


Pertence a: Module 1 — Auth
Título: Configurar JWT e JwtAuthGuard base
Descrição: Claims `sub`, `type: user_access`, `roles`, `perms`, `exp`; TTL configurável por env; secret apenas em variáveis de ambiente.
Critérios de aceitação:

- claims alinhados ao PRD
- TTL configurável
- guard aplicável a rotas protegidas de teste
Prioridade: Urgent
Estimativa: 5 SP
Label: jwt, passport, sprint-3

5) Documentação JWT para consumidores internos (papéis e permissões)
Status: done


Pertence a: Module 7 — Documentação
Título: Documentar claims e validação do token para módulos ERP
Descrição: Página ou seção em `docs/` explicando como validar assinatura, `exp`, `type`, e uso de `perms` em autorização local; exemplos de payload.
Critérios de aceitação:

- documento linkado no README
- exemplos de JWT decodificado
- orientações de não duplicar matriz de permissões fora do Core
Prioridade: High
Estimativa: 2 SP
Label: docs, jwt, rbac, sprint-3

6) Testes e2e mínimos: login, refresh, `/me` (RNF06, CA01)
Status: done


Pertence a: Module 8 — Qualidade
Título: Suite e2e dos fluxos humanos principais
Descrição: Testes de integração/e2e cobrindo happy path e caso de refresh inválido; base para CI posterior.
Critérios de aceitação:

- testes automatizados passam localmente
- fluxos login→me e refresh documentados no código ou README de testes
Prioridade: High
Estimativa: 5 SP
Label: e2e, testing, sprint-3

7) Spike de teste manual: papéis e permissões em ambiente de dev
Status: done


Pertence a: Module 1 — Auth / QA interno
Título: Validar fluxo com usuário seed e permissões mínimas
Descrição: Criar seed ou script que permita logar como usuário com role/permissão de teste e chamar `/me` confirmando `perms`; antecipa RBAC completo da Sprint 4.
Critérios de aceitação:

- passo a passo documentado no README ou docs
- `GET /me` reflete permissões seed
- evidência em sprint review
Prioridade: Medium
Estimativa: 2 SP
Label: rbac, spike, devx, sprint-3

8) PermissionsGuard e decorator de permissão nas rotas admin
Status: done


Pertence a: Module 6 — APIs / AuthZ
Título: Implementar `PermissionsGuard` + `@RequirePermissions(...)`
Descrição: Após JwtAuthGuard, verificar `perms` do token contra metadados da rota; negado → 403 `AUTHZ_FORBIDDEN` (PRD §19).
Critérios de aceitação:

- rotas admin sem permissão retornam 403 com código estável
- matriz de teste documentada
Prioridade: Urgent
Estimativa: 5 SP
Label: guards, rbac, sprint-3

9) CRUD de usuários (RF09) com permissões administrativas
Status: done


Pertence a: Module 2 — Users
Título: Endpoints `GET/POST/PATCH` `/v1/users` e status
Descrição: Listagem paginada, detalhe, criação, atualização e alteração de status; proteger com JWT de usuário + permissões necessárias.
Critérios de aceitação:

- rotas exigem permissão adequada
- usuário inativo tratado conforme RN01
- duplicidade de e-mail 409
Prioridade: Urgent
Estimativa: 5 SP
Label: users, crud, sprint-3

Resumo Sprint 3
Auth completo (register/login/refresh/me) + JWT + docs para consumidores + e2e + spike RBAC + PermissionsGuard + CRUD de Usuários

---

Sprint 4 (estendida) — 18/04/2026 a 24/04/2026

1) CRUD de papéis e permissões (RF10, RF11)
Status: done


Pertence a: Module 3 — Roles / Module 4 — Permissions
Título: Endpoints de roles e permissions e catálogo listável
Descrição: Criar e listar roles e permissions; códigos únicos com `RESOURCE_CONFLICT` em duplicidade (RN06).
Critérios de aceitação:

- CRUD mínimo alinhado ao PRD §14.4
- códigos de permissão semânticos conforme convenção
Prioridade: Urgent
Estimativa: 5 SP
Label: roles, permissions, sprint-4

2) Vínculos usuário–papel e papel–permissão (RF12, RF13)
Status: done


Pertence a: Module 3 — Roles
Título: Associar e remover usuários e permissões aos papéis
Descrição: Endpoints conforme catálogo PRD; validação referencial RN07.
Critérios de aceitação:

- vínculos persistidos corretamente
- remoção idempotente ou erro claro
- documentado no OpenAPI
Prioridade: Urgent
Estimativa: 5 SP
Label: rbac, links, sprint-4

3) Seed de papéis/permissões iniciais e teste e2e 403
Status: done


Pertence a: Module 8 — Qualidade
Título: Matriz mínima e testes de autorização
Descrição: Seed `admin`, `manager`, `operator`, `viewer` (RN08) com permissões exemplo; teste e2e provando que usuário sem `user:write` não acessa escrita.
Critérios de aceitação:

- seed reproduzível
- e2e cobre 403 em caso realista
- documentação dos `permission.code` iniciais
Prioridade: High
Estimativa: 3 SP
Label: seed, e2e, rbac, sprint-4

4) Mapear permissões por endpoint (reuso por outros squads)
Status: done


Pertence a: Module 6 — APIs / Documentação
Título: Publicar matriz de permissões por endpoint administrativo
Descrição: Consolidar matriz endpoint x permission.code para evitar ambiguidades em integrações internas e facilitar onboarding de outros módulos do ERP.
Critérios de aceitação:

- matriz publicada e versionada no repositório
- cada endpoint administrativo com permission.code explícito
- referência cruzada com Swagger e guia de integração
Prioridade: High
Estimativa: 2 SP
Label: rbac, permissions-matrix, docs, sprint-4

5) CRUD de aplicações e regeneração de secret (RF14, RF15)
Status: done

Pertence a: Module 5 — Applications
Título: `POST/GET/PATCH` `/v1/applications` e `regenerate-secret`
Descrição: `client_id` único; `client_secret` só na criação ou regenerate; listagem sem secret (RN02).
Critérios de aceitação:

- secret nunca retorna em GET lista/detalhe
- regenerate retorna secret uma vez
- app inativa não emite token na integração
Prioridade: Urgent
Estimativa: 5 SP
Label: applications, oauth-client, sprint-4

6) Catálogo de escopos e vínculo aplicação–escopo (RF16)
Status: done


Pertence a: Module 5 — Applications
Título: `GET/POST` `/v1/applications/:id/scopes`
Descrição: Escopos globais; associação N:N; validação de escopos solicitados ⊆ cadastrados no token M2M.
Critérios de aceitação:

- escopos persistidos e listados
- validação de subset no fluxo de token
- documentado no Swagger
Prioridade: Urgent
Estimativa: 5 SP
Label: scopes, integration, sprint-4

7) Token M2M e OAuth token endpoint (RF17, RF21, RF22, RF23)
Status: done


Pertence a: Module 5 — Integration
Título: `POST /v1/integration/token` e `POST /v1/oauth/token`
Descrição: Suportar `client_credentials` com escopos; `refresh_token` alinhado à rotação; `application/x-www-form-urlencoded` (ou JSON se padronizado e documentado no OpenAPI RF20).
Critérios de aceitação:

- client_credentials retorna JWT `type: integration_access`
- refresh_token grant com rotação
- alias ou equivalência documentada entre rotas de conveniência
Prioridade: Urgent
Estimativa: 8 SP
Label: oauth, m2m, token-endpoint, sprint-4

8) JWT integração e ScopesGuard (RF18, CA07)
Status: done


Pertence a: Module 6 — APIs / Integration
Título: Validar escopos no consumo (`@RequireScopes`)
Descrição: Rotas que aceitam JWT M2M declaram escopos mínimos; guard compara com `scopes` do token (PRD §12.4).
Critérios de aceitação:

- rota de exemplo protegida por escopo
- token sem escopo retorna 403 `AUTHZ_FORBIDDEN`
- comportamento documentado
Prioridade: Urgent
Estimativa: 5 SP
Label: scopes-guard, jwt, sprint-4

9) Documentação pública de integração M2M (RFC 6749 + exemplos)
Status: done


Pertence a: Module 7 — Documentação
Título: Guia de integração para parceiros e módulos
Descrição: `curl` para `client_credentials`, descrição de `client_id`/`client_secret`, escopos e tratamento de erros OAuth; referência ao Swagger.
Critérios de aceitação:

- documento no repositório
- exemplos copiáveis
- erros previsíveis com `error.code` mencionados
Prioridade: Urgent
Estimativa: 3 SP
Label: docs, m2m, oauth, sprint-4

10) OpenAPI: token endpoint OAuth e erros alinhados à RFC (RF20)
Status: done


Pertence a: Module 6 — APIs
Título: Completar Swagger com OAuth 2.0 token endpoint
Descrição: Parâmetros `grant_type`, `client_id`, `client_secret`, `scope`, respostas e erros OAuth documentados.
Critérios de aceitação:

- RF20 satisfeito no Swagger
- exemplos de erro OAuth
- segurança documentada
Prioridade: High
Estimativa: 3 SP
Label: openapi, oauth, sprint-4

11) Testes e2e M2M e spike manual com aplicação de teste
Status: done


Pertence a: Module 8 — Qualidade
Título: e2e client credentials e negação por escopo
Descrição: Fluxo obter token → chamar rota protegida por escopo; caso negativo sem escopo.
Critérios de aceitação:

- e2e verde localmente
- cenários descritos na doc de testes
Prioridade: High
Estimativa: 5 SP
Label: e2e, testing, sprint-4

Resumo Sprint 4
RBAC completo (CRUD, vínculos, seed e matriz docs) + Integrações M2M (Apps, escopos, tokens, OAuth endpoint, ScopesGuard e docs)

---

Sprint 5 — 25/04/2026 a 08/05/2026

> **Status da sprint:** ✔️ Encerrada — segurança operacional, observabilidade e encerramento do MVP backend (CI/cobertura tratados pela Squad 5 no ecossistema).

1) Rate limit e lockout (RNF07)
Status: done


Pertence a: Module 1 — Auth / Infra
Título: Limitar tentativas em `POST /v1/auth/login` e rotas análogas
Descrição: Por IP e por e-mail; bloqueio temporário após falhas consecutivas; resposta 429 `RATE_LIMIT_EXCEEDED` quando aplicável.
Critérios de aceitação:

- limites configuráveis por env
- comportamento documentado em docs/erros
- testes básicos de limite
Prioridade: Urgent
Estimativa: 5 SP
Label: rate-limit, security, sprint-5

2) Logs estruturados JSON com requestId (RNF11)
Status: done


Pertence a: Module 6 — Common
Título: Correlation id em todas as requisições
Descrição: Gerar/propagar `requestId` em middleware e incluir em logs e opcionalmente em `meta` da resposta.
Critérios de aceitação:

- logs em JSON
- requestId presente em fluxo completo
- alinhado a PRD §21
Prioridade: High
Estimativa: 3 SP
Label: logging, observability, sprint-5

3) Auditoria mínima de eventos críticos (§21)
Status: done

Pertence a: Module 9 — Audit
Título: Registrar login sucesso/falha, refresh, regenerate secret, mudança de status
Descrição: Persistência ou logs estruturados dedicados conforme decisão do squad; correlacionar com `requestId` quando possível.
Critérios de aceitação:

- eventos mínimos cobertos
- formato documentado
- não bloquear fluxos em caso de falha de auditoria
Prioridade: High
Estimativa: 5 SP
Label: audit, logging, sprint-5

4) Healthcheck com dependências (RF19, RNF09)
Status: done

Pertence a: Module 6 — Health
Título: `GET /v1/health` reflete estado do banco
Descrição: Liveness/readiness; falha de DB explícita na resposta para orquestrador.
Critérios de aceitação:

- health distingue ok/degraded
- documentado no Swagger
Prioridade: High
Estimativa: 2 SP
Label: health, kubernetes, sprint-5

5) Pipeline CI: lint, testes, build (DoD)
Status: done


Pertence a: Module 7 — Infraestrutura e Documentação
Título: GitHub Actions (ou CI equivalente) para o repositório
Descrição: Rodar ESLint/Prettier, testes unitários e e2e, build Nest em PR ou push principal.
Critérios de aceitação:

- pipeline verde no repositório
- falha bloqueia merge
- documentado no README
Prioridade: Urgent
Estimativa: 5 SP
Label: ci, devops, sprint-5

6) Cobertura de testes em módulos críticos (RNF05)
Status: done


Pertence a: Module 8 — Qualidade
Título: Elevar cobertura em auth, autorização e integração
Descrição: Medir cobertura com Jest; foco em serviços de domínio críticos; excluir boilerplate se necessário.
Critérios de aceitação:

- ≥80% nos módulos definidos como críticos ou justificativa documentada
- relatório no CI
Prioridade: High
Estimativa: 8 SP
Label: testing, coverage, sprint-5

7) Helmet e CSP por ambiente (P1 PRD §20)
Status: done


Pertence a: Module 6 — APIs
Título: Headers de segurança HTTP
Descrição: Helmet em Nest; CSP mais permissiva em dev (Swagger) e restritiva em produção conforme PRD.
Critérios de aceitação:

- headers presentes em respostas
- CSP não quebra Swagger em dev
- notas em documentação
Prioridade: Medium
Estimativa: 3 SP
Label: helmet, security, sprint-5

8) README e exemplos públicos (README, §23 DoD)
Status: done


Pertence a: Module 7 — Documentação
Título: Exemplos `curl` e fluxo completo humano + M2M
Descrição: Seção de início rápido: subir stack, criar admin, login, chamar `/me`; obter token integração e chamar rota com escopo.
Critérios de aceitação:

- comandos testados
- links para Swagger e docs de erros
- checklist DoD atualizado
Prioridade: Urgent
Estimativa: 3 SP
Label: docs, readme, sprint-5

9) Seed final de papéis e matriz de permission.code (P1)
Status: done


Pertence a: Module 5 — Banco de Dados
Título: Consolidar seed e convenções para squads consumidores
Descrição: Lista estável inicial de `permission.code` e escopos; comunicação aos outros módulos do ERP.
Critérios de aceitação:

- seed idempotente
- tabela ou doc de matriz versionada
- owners definidos para evolução
Prioridade: High
Estimativa: 3 SP
Label: seed, governance, sprint-5

10) Revisão de DoD e encerramento MVP (§23)
Status: done


Pertence a: Squad 1 — Planejamento
Título: Checklist de Definition of Done e riscos
Descrição: Revisar DoD do PRD: Swagger completo, sem segredos no repo, health, e2e principais, documentação integração.
Critérios de aceitação:

- checklist completo ou itens explícitos abertos como débito
- feedback de squads consumidores registrado
Prioridade: High
Estimativa: 2 SP
Label: dod, release, sprint-5

Resumo Sprint 5
Segurança operacional (rate limit, hardening HTTP) + observabilidade + auditoria + CI/CD + qualidade + docs finais e encerramento MVP

---

Sprint 6 — 09/05/2026 a 15/05/2026

> **Status da sprint:** ✔️ Encerrada — frontend administrativo completo (auth, CRUD, RBAC, M2M). RNF08 (política de senha) implementada no backend e no formulário admin.

1) Setup do Projeto Frontend (React + Vite + TS)
Status: done


Pertence a: Module 08 — Frontend Administrativo
Título: Inicializar projeto Frontend com Vite e TypeScript
Descrição: Configurar estrutura base, roteamento (React Router), gerenciamento de estado e sistema de estilos (Vanilla CSS/CSS Modules) seguindo padrões premium.
Critérios de aceitação:
- Projeto rodando com `npm run dev`
- Roteamento base configurado
- Estrutura de pastas organizada (components, hooks, services, pages)
Prioridade: Urgent
Estimativa: 5 SP
Label: frontend, setup, vite, react, sprint-6

2) Fluxo de Autenticação e Proteção de Rotas
Status: done


Pertence a: Module 08 — Frontend Administrativo
Título: Implementar Login, Logout e Guards de Rota
Descrição: Interface de login integrada ao `POST /v1/auth/login`, armazenamento seguro de tokens (cookies/localStorage) e interceptação de rotas privadas.
Critérios de aceitação:
- Tela de login com validações
- Persistência de sessão (Access/Refresh Token)
- Redirecionamento automático para login se não autenticado
Prioridade: Urgent
Estimativa: 8 SP
Label: frontend, auth, jwt, sprint-6

3) Dashboard e Perfil do Usuário
Status: done


Pertence a: Module 08 — Frontend Administrativo
Título: Desenvolver Dashboard e Página de Perfil (/me)
Descrição: Interface inicial com resumo do sistema e página de visualização dos dados do usuário logado consumindo `GET /v1/auth/me`.
Critérios de aceitação:
- Dashboard funcional com métricas simples (mockadas ou reais)
- Página de perfil exibindo permissões e papéis do usuário
Prioridade: High
Estimativa: 5 SP
Label: frontend, dashboard, profile, sprint-6

4) Gerenciamento de Usuários (CRUD)
Status: done

Pertence a: Module 08 — Frontend Administrativo
Título: Implementar Módulo de Gestão de Usuários
Descrição: Listagem paginada, criação, edição e alteração de status de usuários.
Critérios de aceitação:
- Tabela de usuários com busca e paginação
- Formulário de criação/edição com validações
- Integração completa com `/v1/users`
Prioridade: High
Estimativa: 8 SP
Label: frontend, users, crud, sprint-6

5) Gestão de Papéis e Permissões (RBAC)
Status: done

Pertence a: Module 08 — Frontend Administrativo
Título: Implementar Interface para RBAC
Descrição: Gestão de Roles e Permissions, incluindo a associação de usuários a papéis e papéis a permissões.
Critérios de aceitação:
- CRUD de Roles e Permissions
- Interface de atribuição N:N (Drag and drop ou Multiselect)
- Feedback visual de permissões salvas
Prioridade: High
Estimativa: 8 SP
Label: frontend, rbac, roles, sprint-6

6) Gestão de Aplicações M2M
Status: done

Pertence a: Module 08 — Frontend Administrativo
Título: Implementar Interface para Aplicações e Escopos
Descrição: Criar e gerenciar aplicações externas, gerar Client Secrets e associar escopos.
Critérios de aceitação:
- CRUD de Aplicações
- Fluxo de exibição única de Client Secret
- Gestão de escopos por aplicação
Prioridade: Medium
Estimativa: 5 SP
Label: frontend, m2m, applications, sprint-6

Resumo Sprint 6
Desenvolvimento completo do Frontend Administrativo (Módulo 08), incluindo Auth, Dashboard, Gestão de Usuários, RBAC e Integrações M2M.

---

Sprint 7 — 16/05/2026 a 22/05/2026

> **Status da sprint:** ✔️ Encerrada — guia de integração, snippet de validação JWT e homologação com squads consumidores.

1) Guia de Integração para Outros Módulos
Status: done

Pertence a: Module 7 — Infraestrutura e Documentação
Título: Criar Documentação Técnica de Integração
Descrição: Documento detalhado sobre como outros módulos devem consumir o Core/Auth (M2M, RBAC, Validação de JWT).
Critérios de aceitação:
- Guia em Markdown no repositório
- Exemplos de código (Node.js, Python, etc.)
- Fluxograma de autenticação entre módulos
Prioridade: Urgent
Estimativa: 5 SP
Label: docs, integration, m2m, sprint-7

2) SDK/Snippet de Integração Rápida
Status: done


Pertence a: Module 6 — APIs / Common
Título: Desenvolver Middleware/Utilitário de Validação de Token
Descrição: Criar um pequeno pacote ou snippet reutilizável para que outros squads validem o JWT do Core/Auth facilmente.
Critérios de aceitação:
- Código testado e documentado
- Suporte a verificação de scopes/permissions
Prioridade: High
Estimativa: 3 SP
Label: devx, integration, middleware, sprint-7

3) Workshop de Integração e Homologação
Status: done


Pertence a: Squad 1 — Planejamento
Título: Realizar Alinhamento Técnico com Squads Consumidores
Descrição: Sessões de homologação para garantir que os outros módulos conseguem integrar com o Core/Auth sem fricção.
Critérios de aceitação:
- Feedback coletado e bugs de integração registrados
- Pelo menos um módulo integrando com sucesso em staging
Prioridade: High
Estimativa: 3 SP
Label: alignment, integration, sprint-7

Resumo Sprint 7
Foco total na documentação de integração, guias técnicos e suporte para que o Core/Auth seja consumido por todo o ecossistema ERP.

---

Sprint 8 — 23/05/2026 a 29/05/2026

> **Status da sprint:** 🚀 Em andamento — tasks 1–9 (frontend ADR-001) concluídas; tasks 10–17 (Alicerce integrado + demo CTO até **29/05/2026**).
>
> **Origem das tasks 1–6:** bootstrap (`prompts/bootstrap.txt`) + delta entre `docs/PadraoFront/Padronizacao.md` (ADR-001) e o código atual em `frontend/`. Pasta real do app: `frontend/` (não `Frontend/`).

1) Tokens CSS globais e fundação do Design System (ADR-001)
Status: done

Pertence a: Module 08 — Frontend Administrativo
Título: Migrar `index.css` para tokens semânticos do ADR-001
Descrição: Substituir a paleta legada (`--color-bg: #0B132B`, `--color-primary: #88A0A8`, etc.) pelos tokens de `docs/PadraoFront/Padronizacao.md` (§3–§7, §11, §14): backgrounds (`--color-bg-app`, `--color-bg-sidebar`, `--color-bg-surface`), brand (`--color-brand-primary`), texto, bordas, status, espaçamento, radius e sombras. Manter import da fonte Inter.
Critérios de aceitação:
- `:root` expõe tokens semânticos conforme ADR (sem cores hardcoded fora dos tokens)
- Tipografia base usa escala ADR (`--font-size-*`, `--font-weight-*`)
- `:focus-visible` global conforme §12
Prioridade: Urgent
Estimativa: 3 SP
Label: frontend, design-system, tokens, sprint-8

2) AppShell: Sidebar e Topbar alinhados ao layout ADR
Status: done

Pertence a: Module 08 — Frontend Administrativo
Título: Refatorar `Layout.tsx` / `Layout.css` para padrão AppShell
Descrição: Ajustar sidebar (240px, `--color-bg-sidebar`), item ativo com fundo `--color-brand-muted` e borda esquerda `--color-brand-primary` (§8.2), topbar 56px com `--color-bg-header` (§8.3). Remover destaque ativo com fundo sólido cinza (`nav-item.active` atual). Logo/ícone de marca com `--color-icon-brand`.
Critérios de aceitação:
- Sidebar 240px fixa; item ativo segue spec ADR (não bloco sólido cinza)
- Header/topbar 56px com borda `--color-border-subtle`
- Menu mobile (overlay) preservado e funcional em ≤768px
Prioridade: Urgent
Estimativa: 3 SP
Label: frontend, layout, appshell, sprint-8

3) Biblioteca UI base: Button, Input, Card, Badge e Table
Status: done

Pertence a: Module 08 — Frontend Administrativo
Título: Alinhar componentes em `frontend/src/components/ui/` ao ADR-001
Descrição: Atualizar `Button.css/tsx` (primário `#0466c8`, secundário, ghost — §9.1), `Input.css` (altura 38px, focus ring — §9.3), `Card.css` (superfície, borda, radius 12px — §9.2), `Badge.css` (variantes success/warning/danger/info — §9.3), `Table.css` (cabeçalho overline, hover — §9.5). Estados hover/active/disabled/focus/loading em todos (§13).
Critérios de aceitação:
- Variantes de botão correspondem ao ADR (primário azul vivo, não cinza)
- Inputs com focus ring `rgba(4, 102, 200, 0.20)`
- Badges usam tokens `--color-*-muted` e bordas semânticas
- Nenhum componente UI referencia tokens legados removidos
Prioridade: Urgent
Estimativa: 5 SP
Label: frontend, ui-components, design-system, sprint-8

4) Páginas administrativas CRUD: Users, Roles e Applications
Status: done

Pertence a: Module 08 — Frontend Administrativo
Título: Aplicar Design System nas telas de gestão
Descrição: Revisar `UsersPage.tsx`, `RolesPage.tsx` e `ApplicationsPage.tsx` (e CSS associados) para consumir tokens e componentes alinhados: tabelas, badges de status (Ativo/Inativo), modais (`--color-bg-elevated`, radius 16px — §9.7), grids e espaçamento `--space-*`. Substituir estilos inline (`style={{ color: ... }}`) por classes utilitárias ou tokens.
Critérios de aceitação:
- Tabelas e badges de status seguem §9.3–§9.5
- Modais de criação/edição/secret one-time com superfície elevada ADR
- Listagens e formulários sem cores legadas (`--color-primary` cinza, `--color-highlight` pêssego)
Prioridade: High
Estimativa: 5 SP
Label: frontend, crud, users, roles, applications, sprint-8

5) Telas de autenticação e Dashboard (metric cards)
Status: done

Pertence a: Module 08 — Frontend Administrativo
Título: Alinhar Login, Register, Profile e Dashboard ao ADR
Descrição: Atualizar `LoginPage.css`, `RegisterPage.tsx`, `ProfilePage.css`, `DashboardPage.css` e `PrivateRoute.tsx` (loading). Dashboard: metric cards conforme §9.2 (`metric-label` overline, `metric-value` 28px/700, tons brand/success/warning/danger). Referência visual: `docs/PadraoFront/preview_adr_design_system.jsx`.
Critérios de aceitação:
- Login/Register usam fundo `--color-bg-app` e card `--color-bg-surface`
- Metric cards do dashboard seguem estrutura ADR (label overline + valor destacado)
- `PrivateRoute` loading sem cor hardcoded `#F5D3C8`
Prioridade: High
Estimativa: 3 SP
Label: frontend, auth, dashboard, sprint-8

6) Feedback global: Toasts e estados de carregamento
Status: done

Pertence a: Module 08 — Frontend Administrativo
Título: Implementar toasts e padronizar feedback de operações
Descrição: Criar mecanismo de toast (§9.8) para sucesso/erro em CRUD e auth; padronizar skeleton/spinner nas páginas que hoje exibem texto “Loading…” inline. Garantir mensagens de erro de formulário com texto explícito (§12).
Critérios de aceitação:
- Toasts para operações CRUD (criar/editar/status/secret regenerate) e falhas de API
- Estados loading consistentes (componente ou classe reutilizável)
- Erros de validação exibem mensagem textual, não só borda
Prioridade: Medium
Estimativa: 3 SP
Label: frontend, ux, toasts, a11y, sprint-8

7) Bug Bash e Refinamento de UI/UX
Status: done

Pertence a: Module 08 — Frontend Administrativo
Título: Correções Finais e Polimento de Interface
Descrição: Revisão de bugs reportados após migração ADR, ajustes de responsividade e melhorias na experiência do usuário (transições, consistência entre páginas).
Critérios de aceitação:
- Zero bugs críticos abertos
- UI consistente em diferentes resoluções (mobile sidebar, tabelas, modais)
Prioridade: High
Estimativa: 5 SP
Label: frontend, bugfix, ux, sprint-8

8) Auditoria Final de Segurança e Performance
Status: done

Pertence a: Module 9 — Audit / Infra
Título: Revisão de Segurança e Otimização de Queries
Descrição: Executar scan de vulnerabilidades, revisar logs de auditoria e garantir que as queries do Prisma estão otimizadas.
Critérios de aceitação:
- Relatório de auditoria sem falhas graves
- Performance de endpoints críticos abaixo de 200ms
Prioridade: High
Estimativa: 3 SP
Label: security, performance, audit, sprint-8

9) Encerramento do escopo frontend (ADR-001)
Status: done

Pertence a: Squad 1 — Planejamento
Título: Formalizar conclusão da migração ADR no admin
Descrição: Registrar conclusão das tasks 1–8 da Sprint 8; entrega Alicerce integrada e apresentação ao CTO nas tasks 10–17 (mesma sprint, até 29/05/2026).
Critérios de aceitação:
- Build `frontend/` verde
- Checklist ADR-001 assinado pelo squad
Prioridade: High
Estimativa: 1 SP
Label: delivery, frontend, sprint-8

10) Papel `suporte` e usuário demo (integração Squad 4)
Status: pending

Pertence a: Module 5 — Banco de Dados / Module 1 — Auth
Título: Criar role `suporte` com RBAC restrito
Descrição: Adicionar papel `suporte` no seed com permissões de leitura operacional (ex.: `customers:read`, service-desk) **sem** permissões financeiras (`finance:*` ou equivalentes acordados com Squad 2). Criar usuário demo `suporte@example.com` vinculado ao papel. Atualizar `docs/PERMISSIONS_MATRIX.md`.
Critérios de aceitação:
- Role `suporte` existe após `npx prisma db seed`
- Token de login do usuário demo contém `roles: ["suporte"]` e **não** contém perms de domínio financeiro
- Squad 4 consegue demonstrar 403 na API Fiscal com esse token
Prioridade: Urgent
Estimativa: 3 SP
Label: rbac, seed, suporte, squad-4, sprint-8

11) API de identidade M2M para squads consumidoras (Squad 2 e 3)
Status: pending

Pertence a: Module 6 — APIs / Module 2 — Integração
Título: Expor leitura de usuário por UUID para integração server-to-server
Descrição: Endpoint dedicado (ex.: `GET /v1/integration/users/:id`) protegido por JWT `integration_access` e escopo mínimo (`users:read` ou `identity:read`), retornando `id`, `name`, `email`, `status` — sem senha. Documentar em `docs/INTEGRATION_GUIDE.md` com URL K8s (`core-engine-svc...`) e fluxo client_credentials. Squad 2 usa para emitente; Squad 3 para exibir nome do usuário logado a partir do `sub` do JWT.
Critérios de aceitação:
- Token M2M com escopo correto obtém 200; sem escopo ou token humano inadequado retorna 403
- Resposta no envelope padrão; OpenAPI atualizado
- Exemplo cURL no guia de integração
Prioridade: Urgent
Estimativa: 5 SP
Label: integration, m2m, users, squad-2, squad-3, sprint-8

12) Multi-tenant: modelo de dados e claim `tenant_id`
Status: pending

Pertence a: Module 5 — Banco de Dados / Module 1 — Auth
Título: Introduzir tenant no domínio e no JWT de usuário
Descrição: Modelar entidade `Tenant` (ou `tenant_id` em `User`) com seed de tenant padrão; incluir claim `tenant_id` no access token (`user_access`) junto a `sub` (user_id), `roles` e `perms`. Documentar equivalência `sub` ↔ `user_id` para o checklist do CTO.
Critérios de aceitação:
- Migração Prisma aplicável ao schema `core_engine`
- Login emite JWT com `tenant_id` preenchido
- `GET /v1/auth/me` retorna `tenantId` (ou objeto tenant)
Prioridade: Urgent
Estimativa: 8 SP
Label: multi-tenant, jwt, database, sprint-8

13) Multi-tenant: propagação em headers e isolamento de consultas
Status: pending

Pertence a: Module 6 — Common / Module 1 — Auth
Título: Propagar `X-Tenant-Id` e filtrar dados por tenant
Descrição: Middleware que exige/propaga header `X-Tenant-Id` (ou extrai de JWT) em rotas administrativas; queries Prisma de usuários (e demais entidades tenant-scoped) filtradas por `tenant_id`. Demonstrar que dados de um tenant não aparecem para outro (prova de isolamento do Alicerce).
Critérios de aceitação:
- Requisições sem tenant coerente com o token retornam 400/403 documentado
- Listagem/detalhe de usuários respeita tenant do token
- Nota técnica no guia de integração para squads replicarem o header nas chamadas ao Core
Prioridade: Urgent
Estimativa: 5 SP
Label: multi-tenant, isolation, headers, sprint-8

14) Gateway multi-módulo (roteamento para squads)
Status: pending

Pertence a: Module 7 — Infraestrutura
Título: Configurar proxy/gateway para APIs do ecossistema
Descrição: Estender configuração de gateway (nginx no `frontend/nginx.conf` e/ou compose/K8s) para rotear prefixos aos serviços das squads (ex.: fiscal, crm-leads, service-desk) mantendo `/v1/auth` e `/v1/integration` no Core. Variáveis de ambiente para upstreams (`*_SVC_URL`). Alinhar com Squad 5 (Portal Conexus) sem duplicar login nas outras squads.
Critérios de aceitação:
- Documento `docs/GATEWAY.md` (ou seção no README) com mapa de rotas e hosts internos K8s
- Demo local ou staging: uma URL de entrada encaminha ao Core e a pelo menos um módulo externo
- Nenhuma rota de login nas squads consumidoras — apenas validação do JWT do Core
Prioridade: Urgent
Estimativa: 5 SP
Label: gateway, nginx, infra, squad-5, sprint-8

15) Seed de aplicações M2M por squad e escopos de identidade
Status: pending

Pertence a: Module 5 — Banco de Dados / Module 2 — Integração
Título: Registrar clientes M2M (`finance-fiscal`, `crm-leads`, etc.)
Descrição: No seed, criar Applications com `client_id`/`client_secret` de demonstração para squads consumidoras e vincular escopos (`users:read` / `identity:read`, domínios acordados). Secrets apenas para ambiente de demo; documentar rotação em produção.
Critérios de aceitação:
- Cada squad consumidora tem app de teste documentada
- `POST /v1/oauth/token` com `client_credentials` retorna token utilizável na task 11
Prioridade: High
Estimativa: 3 SP
Label: seed, m2m, applications, sprint-8

16) Roteiro de demo e checklist CTO (5 passos)
Status: pending

Pertence a: Module 7 — Documentação / Squad 1 — Planejamento
Título: Documentar roteiro de apresentação integrada
Descrição: Criar ou atualizar `docs/DEMO_CTO.md` mapeando: (1) multi-tenant/`tenant_id`, (2) SSO/JWT entre squads, (3) schema isolado, (4) resiliência (papel Squad 2/5), (5) docker-compose integrado. Incluir scripts cURL, usuários de demo e ordem de falas para entrega do Alicerce.
Critérios de aceitação:
- Checklist do CTO respondido ponto a ponto com evidências
- Tech leads 2–4 validaram endpoints necessários (users M2M, suporte, UUID)
Prioridade: High
Estimativa: 2 SP
Label: docs, demo, cto, sprint-8

17) Apresentação final ao CTO (29/05/2026)
Status: pending

Pertence a: Squad 1 — Planejamento
Título: Demo Alicerce + checklist técnico
Descrição: Demonstrar Central de Identidade, claims do token (`user_id`/`sub`, `tenant_id`, `roles`), API de gateway e isolamento; reforçar regra de ouro (login só no Core). Suporte às demos dependentes das Squads 2, 3 e 4.
Critérios de aceitação:
- Demo realizada com sucesso em 29/05/2026
- Tasks 10–16 concluídas ou débitos explícitos registrados
Prioridade: Urgent
Estimativa: 2 SP
Label: delivery, cto, demo, sprint-8

Resumo Sprint 8
Frontend ADR-001 concluído (tasks 1–9). Em andamento até **29/05/2026**: papel **suporte**, **multi-tenant** (claim + header + isolamento), **gateway multi-módulo**, API M2M de usuários (Squads 2–3), seeds M2M, roteiro e demo CTO (tasks 10–17).

---

Resumo geral (Sprints 2 a 8 até 29/05/2026)

| Sprint | Período | Foco principal | Status |
|--------|---------|----------------|--------|
| 2 | 22/03–27/03 | Nest, envelope, Swagger, docs de erros, Docker, Prisma alinhado ao PRD | Encerrada |
| 3 | 28/03–17/04 | Auth (register/login/refresh/me), JWT, docs JWT, e2e humano, spike RBAC, PermissionsGuard, CRUD de Usuários | Encerrada |
| 4 | 18/04–24/04 | RBAC completo + Integrações M2M (Apps, escopos, tokens, OAuth, ScopesGuard) | Encerrada |
| 5 | 25/04–08/05 | Segurança, observabilidade, hardening e encerramento MVP backend | Encerrada |
| 6 | 09/05–15/05 | Frontend administrativo (auth, CRUD, RBAC, M2M); **RNF08** (política de senha) implementada | Encerrada |
| 7 | 16/05–22/05 | Guia de integração, snippet e homologação com squads | Encerrada |
| 8 | 23/05–29/05 | ADR-001 no admin (done) + Alicerce: `suporte`, multi-tenant, gateway, API M2M, demo CTO | Em andamento |
