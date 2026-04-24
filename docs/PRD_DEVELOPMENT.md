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
**Status**: ⏳ Em andamento
- **Task 1**: Criação e manutenção do CRUD de Papéis e de Permissões. ✔️ (Concluído em 22/04/2026)
- **Task 2**: Gerenciamento de vínculos relacionais fortes M2M (Usuário-Papel e Papel-Permissão). ✔️ (Concluído em 22/04/2026)
- **Task 3**: Seed de papéis/permissões iniciais e testes e2e de autorização (403). ✔️ (Concluído em 24/04/2026)
- **Task 4**: Matriz de permissões por endpoint publicada e versionada no repositório. ✔️ (Concluído em 24/04/2026)
- **Task 5**: CRUD de aplicações e regeneração de secret (RF14, RF15). ✔️ (Concluído em 23/04/2026)
- **Task 6**: Catálogo de escopos e vínculo aplicação–escopo (RF16). ✔️ (Concluído em 23/04/2026)
- **Task 7**: Token M2M e OAuth token endpoint (RF17, RF21, RF22, RF23). ✔️ (Concluído em 24/04/2026)
- **Task 8**: JWT Integration e ScopesGuard (RF18, CA07). ✔️ (Concluído em 24/04/2026)
- **Task 9**: Documentação pública de integração M2M (RFC 6749 + exemplos). ✔️ (Concluído em 24/04/2026)

---

## 🛠️ Alterações, Modificações e Implementações Técnicas

Durante o desenvolvimento das Sprints 1 a 4, diversas tomadas de decisão cruciais e refatorações se mostraram necessárias:

- **Implementação do RolesModule e PermissionsModule**: Criação de controladores, serviços e DTOs para gestão de RBAC.
- **Segurança de Rotas**: Proteção dos novos endpoints com `JwtAuthGuard` e `PermissionsGuard` utilizando o decorador `@RequirePermissions`.
- **Workaround de Swagger**: Remoção temporária da propriedade `type` nos decoradores `@ApiResponse` dos novos módulos para mitigar um erro crítico de "Circular Dependency" no motor do Swagger/Fastify no ambiente de desenvolvimento Node 25.

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

---

## 📝 Tasks Postergadas
*Nenhuma ocorrência de Task crítica postergada até a Sprint 3. Os ciclos seguem alinhados ao planejamento estabelecido.*
