# Core Engine & Auth — Identity, Access & Integration Core (Squad 1)

**Versão:** 2.1 (revisada e consolidada)  
**Código:** CORE-001  
**Squad:** Squad 1  
**Papel:** Produto central de identidade, autenticação, autorização, permissionamento e integração segura do ERP Modular Cloud-Native.

# 1. Visão geral

O **Core Engine & Auth** é o sistema central de **IAM (Identity and Access Management)** do ecossistema. Seu papel é fornecer uma camada única, segura e padronizada para:

- autenticação de usuários humanos;
- autorização baseada em papéis e permissões;
- gestão de usuários, perfis de acesso e credenciais;
- emissão e validação de tokens;
- autenticação de aplicações e integrações externas;
- proteção consistente das APIs consumidas pelos demais módulos.

O produto opera em **duas frentes complementares**:

## 1.1. Identity Core (uso interno ao ERP)

Responsável por autenticação de usuários humanos, gestão de acesso, RBAC, MFA e proteção de rotas dos módulos internos.

## 1.2. Integration Core (uso por aplicações/clientes)

Responsável por credenciais de aplicação, escopos, emissão de token de integração e documentação pública de consumo da API.

O **backend REST API** é a principal entrega do MVP. Um frontend administrativo poderá existir, mas é secundário e não bloqueia a entrega do produto.

# 2. Problema

Hoje, sistemas modulares sem um núcleo central de identidade e autorização tendem a:

- duplicar lógica de login e controle de acesso;
- aplicar regras diferentes entre módulos;
- dificultar auditoria de acessos e ações sensíveis;
- aumentar risco de falhas de segurança;
- elevar o custo de manutenção e evolução;
- dificultar integrações com parceiros e aplicações terceiras.

Sem esse núcleo, cada squad acaba resolvendo autenticação e permissão de forma própria, gerando inconsistência, retrabalho e risco operacional.

# 3. Objetivo do produto

Criar um núcleo reutilizável de autenticação, autorização e integração segura para sustentar todo o ecossistema do ERP Modular Cloud-Native, reduzindo retrabalho entre squads e elevando o padrão de segurança, rastreabilidade e interoperabilidade.

# 4. Proposta de valor

| Dimensão | Benefício |
|---|---|
| **Segurança** | Política de senha, hash moderno, MFA, rotação de refresh token, rate limiting, proteção de rotas e logs auditáveis. |
| **Padronização** | Todos os módulos passam a consumir a mesma base de autenticação e autorização. |
| **Desacoplamento** | Squads focam no domínio de negócio; identidade e acesso ficam centralizados. |
| **Interoperabilidade** | API REST versionada, JWT, OpenAPI e integração simples por credenciais de aplicação. |
| **Auditabilidade** | Eventos críticos de autenticação, autorização e administração ficam rastreáveis. |
| **Escalabilidade de produto** | Mesmo sem multi-tenant no MVP, o produto já pode atender cenários internos e integrações B2B controladas. |

# 5. Objetivo de negócio

O módulo deve gerar valor em duas frentes:

## 5.1. Valor interno

- acelerar o desenvolvimento dos demais squads;
- reduzir inconsistência de autenticação entre módulos;
- simplificar governança de acesso;
- diminuir custo de manutenção e suporte.

## 5.2. Valor comercial

O Core Engine & Auth pode ser oferecido como base de identidade e integração para:

- empresas com sistemas internos próprios;
- ERPs modulares;
- plataformas SaaS single-tenant;
- clientes que precisam expor integrações seguras com aplicações parceiras.

# 6. Perfis de usuário (personas)

## 6.1. Administrador do sistema

Responsável por criar usuários, alterar status, definir papéis, revisar permissões e habilitar acessos.

**Necessidades principais:**
- cadastrar e manter usuários com rapidez;
- controlar acessos sem editar banco manualmente;
- auditar mudanças críticas;
- reduzir risco de acesso indevido.

**Critério de sucesso:**
- conseguir provisionar ou revogar acesso em poucos minutos, com trilha auditável.

## 6.2. Gestor de TI / Segurança

Responsável por governança de acesso, risco, conformidade e padronização da segurança do ecossistema.

**Necessidades principais:**
- padronizar autenticação entre módulos;
- garantir política de senha e MFA;
- ter rastreabilidade sobre acessos críticos;
- reduzir exposição a falhas de autorização.

**Critério de sucesso:**
- ter uma camada única e confiável de controle de identidade e autorização.

## 6.3. Desenvolvedor de módulo interno

Responsável por integrar seu módulo ao Core para autenticar usuários e validar permissões.

**Necessidades principais:**
- integrar rapidamente;
- confiar na validade do token;
- usar papéis/permissões sem reinventar lógica;
- consumir documentação clara.

**Critério de sucesso:**
- conseguir integrar autenticação e autorização em menos de 1 dia útil com documentação disponível.

## 6.4. Integrador externo / aplicação cliente

Responsável por consumir APIs protegidas com credenciais de aplicação.

**Necessidades principais:**
- receber credenciais seguras;
- ter escopos claros;
- obter token de integração sem depender de fluxo humano;
- entender erros e exemplos de uso.

**Critério de sucesso:**
- autenticar a aplicação e consumir recursos autorizados com previsibilidade.

# 7. Escopo do produto (MVP)

## 7.1. Incluído no MVP — núcleo interno

- cadastro de usuários;
- login com e-mail e senha;
- emissão de access token e refresh token;
- rotação obrigatória de refresh token;
- endpoint `/auth/me`;
- gestão de usuários;
- gestão de roles;
- gestão de permissions;
- vínculo usuário–role;
- vínculo role–permission;
- RBAC para rotas protegidas;
- MFA via TOTP;
- logs estruturados;
- auditoria básica de eventos críticos;
- documentação OpenAPI completa;
- healthcheck.

## 7.2. Incluído no MVP — camada de integração

- cadastro de aplicações/clientes;
- geração e regeneração de `client_secret`;
- escopos por aplicação;
- emissão de token de integração;
- validação de escopos em recursos protegidos;
- documentação pública de integração.

## 7.3. Incluído no MVP — entrega técnica

- API REST versionada em `/v1`;
- JSON como formato padrão;
- autenticação Bearer Token;
- ambiente containerizável;
- testes unitários e e2e mínimos;
- pipeline com lint, testes e build.

# 8. Fora de escopo do MVP

| Item | Status |
|---|---|
| Multi-tenant | Fora do escopo |
| Login social | Fora do escopo |
| SSO corporativo (SAML etc.) | Fora do escopo |
| Authorization Server OAuth 2.0 completo | Fora do MVP |
| OpenID Connect completo | Fora do MVP |
| Federação de identidade | Fora do MVP |
| Frontend administrativo como entrega principal | Fora do MVP |
| Códigos de recuperação MFA | Roadmap |
| Auditoria avançada com dashboard dedicado | Roadmap |
| Eventos/webhooks públicos | Roadmap |

**Decisão consolidada:**  
MFA entra no MVP. Multi-tenant, SSO e OIDC completo permanecem fora de escopo nesta versão.

# 9. Priorização do MVP

## 9.1. Prioridade P0 — obrigatória para go-live

- login com e-mail e senha;
- access token + refresh token;
- rotação de refresh token;
- `/auth/me`;
- CRUD de usuários;
- CRUD de roles;
- CRUD de permissions;
- vínculo usuário–role;
- vínculo role–permission;
- RBAC em rotas;
- cadastro de aplicações;
- `client_secret`;
- emissão de token de integração;
- escopos por aplicação;
- documentação OpenAPI;
- logs estruturados;
- healthcheck.

## 9.2. Prioridade P1 — importante no MVP

- MFA via TOTP;
- bloqueio temporário após falhas consecutivas;
- auditoria básica;
- exemplos públicos de integração.

## 9.3. Prioridade P2 — pós-MVP / roadmap curto

- logout com revogação explícita de sessão;
- eventos/webhooks;
- códigos de recuperação MFA;
- painel administrativo;
- RS256;
- suporte futuro a OAuth/OIDC.

# 10. Requisitos funcionais

| ID | Requisito |
|---|---|
| RF01 | Cadastrar usuário com e-mail único, nome, senha e status inicial. |
| RF02 | Autenticar usuário com e-mail e senha. |
| RF03 | Impedir autenticação de usuário inativo, bloqueado ou removido logicamente. |
| RF04 | Emitir access token JWT após autenticação válida. |
| RF05 | Emitir refresh token e permitir renovação com rotação obrigatória. |
| RF06 | Expor endpoint `/v1/auth/me` com dados do usuário autenticado e autorizações efetivas. |
| RF07 | Permitir ativação de MFA via TOTP com geração de segredo e confirmação por código. |
| RF08 | Exigir MFA no login quando o usuário possuir MFA habilitado. |
| RF09 | Permitir desativação de MFA mediante fluxo seguro de reautenticação. |
| RF10 | Permitir CRUD administrativo de usuários. |
| RF11 | Permitir alteração de status do usuário sem exclusão física obrigatória. |
| RF12 | Permitir CRUD de roles. |
| RF13 | Permitir CRUD de permissions com código único semântico. |
| RF14 | Permitir associar e remover roles de usuários. |
| RF15 | Permitir associar e remover permissions de roles. |
| RF16 | Aplicar RBAC na autorização de rotas protegidas. |
| RF17 | Permitir cadastro de aplicações/clientes de integração. |
| RF18 | Gerar `client_secret` na criação da aplicação. |
| RF19 | Permitir regeneração segura de `client_secret`. |
| RF20 | Permitir associar escopos a aplicações. |
| RF21 | Emitir token de integração via credenciais da aplicação. |
| RF22 | Validar escopos do token de integração nos recursos protegidos. |
| RF23 | Expor endpoint `/v1/health` para liveness/readiness. |
| RF24 | Gerar documentação OpenAPI atualizada para todos os endpoints públicos do MVP. |
| RF25 | Registrar logs estruturados e eventos auditáveis de ações críticas. |

# 11. Requisitos não funcionais

| ID | Categoria | Requisito |
|---|---|---|
| RNF01 | Performance | `GET /v1/health` e `GET /v1/auth/me` com p95 menor que 300 ms em ambiente de referência. |
| RNF02 | Performance | `POST /v1/auth/login` e `POST /v1/integration/token` com p95 menor que 500 ms em ambiente de referência. |
| RNF03 | Token | Access token com TTL padrão de 15 minutos. |
| RNF04 | Token | Refresh token com TTL padrão de 7 dias. |
| RNF05 | Segurança | JWT com HS256 no MVP e secret forte gerenciado por ambiente. |
| RNF06 | Segurança | Senhas com Argon2id preferencial ou Bcrypt cost >= 12. |
| RNF07 | Segurança | Senha com mínimo de 10 caracteres, contendo maiúscula, minúscula, número e caractere especial. |
| RNF08 | Segurança | Lista de senhas comuns deve ser rejeitada. |
| RNF09 | Segurança | Rate limit de 5 tentativas por minuto por IP e por e-mail em rotas sensíveis. |
| RNF10 | Segurança | Bloqueio temporário de 30 minutos após 5 falhas consecutivas no login. |
| RNF11 | Qualidade | Cobertura unitária mínima de 80% nos módulos críticos. |
| RNF12 | Qualidade | Testes e2e mínimos para login, refresh, `/me`, MFA e token de integração. |
| RNF13 | Observabilidade | Logs estruturados em JSON com `requestId`, timestamp, rota e ator quando aplicável. |
| RNF14 | Manutenibilidade | Código TypeScript estrito, validação de entrada e sem segredos no repositório. |
| RNF15 | Disponibilidade | Endpoint de healthcheck utilizável por orquestrador e refletindo falha de dependência. |

# 12. Ambiente de referência para métricas

As métricas do MVP devem ser validadas em ambiente mínimo de referência, para evitar números sem contexto:

- 1 instância de API containerizada;
- PostgreSQL dedicado ao ambiente;
- configuração sem carga extrema;
- volume inicial estimado: até 10 mil usuários cadastrados;
- concorrência de validação: carga moderada de laboratório;
- rede local ou ambiente de testes controlado.

# 13. Regras de negócio

| ID | Regra |
|---|---|
| RN01 | Usuário inativo não autentica. |
| RN02 | Usuário bloqueado não autentica até expiração ou reversão do bloqueio. |
| RN03 | E-mail de usuário deve ser único. |
| RN04 | Permission code deve ser único e semanticamente estável. |
| RN05 | Role name deve ser único. |
| RN06 | `client_secret` só pode ser exibido no momento de criação ou regeneração. |
| RN07 | Refresh token é de uso único após rotação; reuso deve falhar. |
| RN08 | Aplicação inativa não pode obter token de integração. |
| RN09 | Escopos devem ser validados antes do acesso ao recurso protegido por token de integração. |
| RN10 | Exclusão física de usuário não é obrigatória no MVP; o padrão é lifecycle por status. |
| RN11 | MFA habilitado exige segundo fator antes da emissão final dos tokens. |
| RN12 | Toda alteração crítica de acesso deve gerar registro auditável. |

# 14. Lifecycle de entidades

## 14.1. Lifecycle de usuário

Estados válidos:

- `pending`
- `active`
- `inactive`
- `blocked`
- `deleted` (soft delete)

Transições esperadas:

- `pending -> active`
- `active -> inactive`
- `active -> blocked`
- `blocked -> active`
- `inactive -> active`
- `active/inactive/blocked -> deleted`

Efeitos:

- `active`: autentica normalmente;
- `inactive`: não autentica;
- `blocked`: não autentica;
- `deleted`: não autentica e não aparece como usuário operacional padrão.

## 14.2. Lifecycle de aplicação

Estados válidos:

- `active`
- `inactive`
- `revoked`

Efeitos:

- `active`: pode solicitar token;
- `inactive`: não pode solicitar token;
- `revoked`: secret anterior inválido, uso bloqueado até nova regularização.

# 15. User stories principais

## 15.1. Administração de acesso

Como **administrador do sistema**, quero cadastrar, ativar, desativar e vincular papéis a usuários para controlar acesso com segurança e rapidez.

## 15.2. Autenticação humana

Como **usuário interno**, quero fazer login com minhas credenciais e, quando necessário, confirmar MFA para acessar apenas os módulos autorizados.

## 15.3. Governança de permissões

Como **gestor de TI**, quero manter roles e permissions padronizadas para garantir rastreabilidade e evitar acessos indevidos.

## 15.4. Integração técnica

Como **desenvolvedor de módulo interno**, quero validar tokens e permissões de forma centralizada para não implementar autenticação do zero em cada módulo.

## 15.5. Integração M2M

Como **integrador externo**, quero autenticar minha aplicação com `client_id` e `client_secret` para consumir APIs protegidas apenas dentro dos escopos permitidos.

## 15.6. Revogação operacional

Como **administrador**, quero inativar rapidamente um usuário ou uma aplicação para interromper acessos indevidos sem depender de alteração manual em banco.

# 16. Casos de uso prioritários

## 16.1. Login padrão

1. Usuário envia e-mail e senha.
2. Sistema valida credenciais.
3. Se MFA não estiver ativo, emite access e refresh token.
4. Usuário chama `/auth/me` e recebe perfil/autorizações.

## 16.2. Login com MFA

1. Usuário envia e-mail e senha.
2. Sistema valida credenciais.
3. Sistema identifica MFA habilitado.
4. Sistema exige TOTP.
5. Usuário informa TOTP válido.
6. Sistema emite access e refresh token.

## 16.3. Refresh token

1. Cliente envia refresh token válido.
2. Sistema valida token.
3. Sistema invalida refresh antigo.
4. Sistema emite novo par access/refresh.
5. Reuso do refresh anterior falha.

## 16.4. Provisionamento de usuário

1. Admin cria usuário.
2. Sistema valida unicidade.
3. Sistema grava usuário com status definido.
4. Admin vincula roles.
5. Ação é auditada.

## 16.5. Revogação de acesso

1. Admin altera usuário para `inactive`.
2. Sistema registra auditoria.
3. Próximas autenticações passam a falhar.

## 16.6. Token de integração

1. Aplicação envia `client_id` e `client_secret`.
2. Sistema valida status e credenciais.
3. Sistema emite token de integração com escopos autorizados.
4. Recursos protegidos validam escopos antes de responder.

# 17. Fluxos excepcionais e de recuperação

## 17.1. Credenciais inválidas

- retornar erro padronizado;
- incrementar contagem de falhas;
- aplicar bloqueio temporário quando atingir limite.

## 17.2. Refresh token reutilizado

- negar operação;
- registrar evento de segurança;
- permitir investigação posterior.

## 17.3. MFA inválido

- negar emissão final dos tokens;
- registrar tentativa malsucedida.

## 17.4. Aplicação inativa

- negar emissão de token de integração;
- retornar erro padronizado.

## 17.5. Duplicidade de recurso

- e-mail duplicado, role duplicada, permission code duplicado ou application identifier duplicado devem retornar conflito.

## 17.6. Perda de dispositivo MFA

- não tratado integralmente no MVP;
- roadmap contempla recovery codes ou fluxo administrativo controlado.

# 18. Matriz RBAC inicial

Esta matriz é uma base inicial do MVP e pode ser refinada.

| Papel | Usuários | Roles | Permissions | Aplicações | Auditoria |
|---|---|---|---|---|---|
| `super_admin` | CRUD total | CRUD total | CRUD total | CRUD total | leitura total |
| `admin` | CRUD operacional | CRUD | CRUD | CRUD | leitura básica |
| `security_manager` | leitura | leitura | leitura/edição controlada | leitura | leitura total |
| `operator` | leitura limitada | não | não | não | não |
| `viewer` | leitura própria ou restrita | não | não | não | não |

**Observação:**  
A validação final deve ocorrer por permission codes e não apenas por nome do papel.

# 19. Modelo de permissões

Padrão recomendado:

`recurso:ação:escopo`

Exemplos:

- `user:read:all`
- `user:write:all`
- `role:read:all`
- `role:write:all`
- `permission:read:all`
- `permission:write:all`
- `application:read:all`
- `application:write:all`
- `audit:read:all`

# 20. Escopos de integração

Formato sugerido para escopos de aplicação:

- `integration.read`
- `integration.write`
- `users.read`
- `users.write`
- `finance.read`
- `orders.read`

Regras:

- escopos são explícitos por aplicação;
- aplicação só recebe no token os escopos autorizados;
- escopo ausente gera `403 Forbidden`;
- escopo não substitui RBAC humano; ele regula apenas tokens de integração.

# 21. Dependências do produto

## 21.1. Dependências técnicas

- PostgreSQL;
- serviço de API em execução;
- gestão segura de variáveis de ambiente;
- containerização;
- biblioteca JWT;
- biblioteca de hash de senha;
- documentação OpenAPI;
- pipeline CI.

## 21.2. Dependências organizacionais

- definição mínima das permissions iniciais;
- alinhamento com squads consumidores;
- definição de ambiente de homologação;
- estratégia de provisionamento de usuários administrativos;
- convenção única de códigos de permission e escopos.

# 22. Dependências entre squads

O Core entrega aos demais módulos:

- autenticação;
- autorização centralizada;
- identidade do usuário autenticado;
- padrão único de token;
- validação de escopos de integração;
- documentação de consumo.

Os demais módulos precisam:

- confiar na validação do token emitido;
- respeitar o padrão de permission codes;
- proteger rotas sensíveis usando RBAC ou escopos;
- evitar reimplementar autenticação local.

# 23. API — catálogo MVP

## 23.1. Auth

- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/mfa/verify`
- `POST /v1/auth/mfa/setup`
- `POST /v1/auth/mfa/disable`
- `POST /v1/auth/refresh`
- `GET /v1/auth/me`

## 23.2. Users

- `GET /v1/users`
- `GET /v1/users/:id`
- `POST /v1/users`
- `PATCH /v1/users/:id`
- `PATCH /v1/users/:id/status`

## 23.3. Roles

- `GET /v1/roles`
- `GET /v1/roles/:id`
- `POST /v1/roles`
- `PATCH /v1/roles/:id`

## 23.4. Permissions

- `GET /v1/permissions`
- `GET /v1/permissions/:id`
- `POST /v1/permissions`
- `PATCH /v1/permissions/:id`

## 23.5. Vínculos

- `POST /v1/users/:id/roles`
- `DELETE /v1/users/:id/roles/:roleId`
- `POST /v1/roles/:id/permissions`
- `DELETE /v1/roles/:id/permissions/:permissionId`

## 23.6. Applications

- `GET /v1/applications`
- `GET /v1/applications/:id`
- `POST /v1/applications`
- `PATCH /v1/applications/:id`
- `PATCH /v1/applications/:id/status`
- `POST /v1/applications/:id/regenerate-secret`

## 23.7. Integration

- `POST /v1/integration/token`

## 23.8. Plataforma

- `GET /v1/health`

# 24. Contratos mínimos de API

## 24.1. Login — request

```json
{
  "email": "admin@empresa.com",
  "password": "SenhaForte@123"
}
```

## 24.2. Login — response sem MFA

```json
{
  "data": {
    "accessToken": "jwt_access",
    "refreshToken": "jwt_refresh",
    "tokenType": "Bearer",
    "expiresIn": 900
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

## 24.3. Login — response com MFA pendente

```json
{
  "data": {
    "mfaRequired": true,
    "challengeType": "totp",
    "temporaryToken": "tmp_token"
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

## 24.4. Refresh — request

```json
{
  "refreshToken": "jwt_refresh"
}
```

## 24.5. Token de integração — request

```json
{
  "clientId": "app_client_id",
  "clientSecret": "app_client_secret"
}
```

## 24.6. Token de integração — response

```json
{
  "data": {
    "accessToken": "jwt_integration",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "scopes": [
      "users.read",
      "orders.read"
    ]
  },
  "meta": {
    "requestId": "req_456"
  }
}
```

# 25. Padrão de resposta

## 25.1. Sucesso

```json
{
  "data": {},
  "meta": {
    "requestId": "req_123",
    "timestamp": "2026-03-22T21:00:00Z"
  }
}
```

## 25.2. Erro

```json
{
  "error": {
    "code": "RESOURCE_CONFLICT",
    "message": "E-mail já cadastrado.",
    "details": []
  },
  "meta": {
    "requestId": "req_123",
    "timestamp": "2026-03-22T21:00:00Z"
  }
}
```

## 25.3. Catálogo inicial de códigos de erro

- `INVALID_CREDENTIALS`
- `MFA_REQUIRED`
- `MFA_INVALID_CODE`
- `TOKEN_INVALID`
- `TOKEN_EXPIRED`
- `TOKEN_REUSED`
- `RESOURCE_CONFLICT`
- `RESOURCE_NOT_FOUND`
- `FORBIDDEN`
- `RATE_LIMIT_EXCEEDED`
- `APPLICATION_INACTIVE`
- `VALIDATION_ERROR`

# 26. Auditoria e logs

## 26.1. Eventos auditáveis mínimos

- login bem-sucedido;
- login malsucedido;
- bloqueio por falha;
- refresh token reutilizado;
- ativação de MFA;
- desativação de MFA;
- criação de usuário;
- alteração de status de usuário;
- criação/alteração de role;
- criação/alteração de permission;
- vínculo de role ao usuário;
- vínculo de permission à role;
- criação de aplicação;
- regeneração de secret;
- falha de autenticação de integração.

## 26.2. Campos mínimos de log

- timestamp;
- requestId;
- rota;
- método;
- status code;
- userId ou clientId quando aplicável;
- tipo do evento;
- origem;
- mensagem resumida.

## 26.3. Retenção mínima

A retenção operacional deve ser definida pelo projeto, mas o MVP precisa garantir persistência suficiente para investigação básica de segurança e suporte.

# 27. Segurança

- senha hasheada com algoritmo forte;
- secrets fora do repositório;
- rotas protegidas por guards;
- validação de payload;
- rate limiting;
- MFA TOTP;
- rotação de refresh token;
- segredo de aplicação não exposto em listagem;
- trilha auditável para ações críticas;
- headers seguros na API.

# 28. Arquitetura e implementação de referência

## 28.1. Stack

- TypeScript
- NestJS
- PostgreSQL
- Prisma
- JWT
- Swagger / OpenAPI
- Docker
- Jest
- class-validator
- class-transformer

## 28.2. Diretriz arquitetural

Arquitetura monolítica modular, com separação por domínio:

- `auth`
- `users`
- `roles`
- `permissions`
- `applications`
- `integration`
- `audit`
- `health`

## 28.3. Observação importante

Este PRD define a direção funcional e técnica mínima do produto. Detalhes internos de implementação, schema completo, ADRs, migrations e decisões finas de segurança podem ficar em documento técnico complementar.

# 29. Métricas de sucesso

## 29.1. Métricas técnicas

- p95 de `/auth/login` dentro do limite definido;
- p95 de `/integration/token` dentro do limite definido;
- cobertura de testes unitários >= 80%;
- fluxos e2e críticos aprovados.

## 29.2. Métricas operacionais

- provisionamento de usuário administrativo sem intervenção em banco;
- revogação de acesso concluída por interface/API administrativa;
- trilha auditável disponível para eventos críticos.

## 29.3. Métricas de adoção

- integração de um módulo interno em até 1 dia útil;
- documentação Swagger suficiente para consumo sem suporte intensivo;
- redução de duplicação de lógica de autenticação entre squads.

# 30. Critérios de aceitação de alto nível

| ID | Critério |
|---|---|
| CA01 | Usuário ativo com credenciais válidas recebe tokens e acessa `/auth/me`. |
| CA02 | Usuário inativo não recebe tokens. |
| CA03 | Usuário com MFA habilitado só recebe tokens finais após TOTP válido. |
| CA04 | Refresh válido gera novo par de tokens e invalida o anterior. |
| CA05 | Refresh reutilizado falha e gera log de segurança. |
| CA06 | Admin consegue criar usuário e vincular role. |
| CA07 | Duplicidade de e-mail gera `409 RESOURCE_CONFLICT`. |
| CA08 | Aplicação ativa com credenciais válidas recebe token de integração. |
| CA09 | Aplicação inativa não recebe token de integração. |
| CA10 | Recurso protegido por escopo rejeita token sem escopo suficiente. |
| CA11 | `client_secret` só aparece na criação ou regeneração. |
| CA12 | Swagger descreve todos os endpoints do MVP com exemplos mínimos. |

# 31. Definition of Done (DoD)

- [ ] módulos críticos implementados;
- [ ] testes unitários >= 80% nos domínios críticos;
- [ ] testes e2e dos fluxos prioritários;
- [ ] Swagger completo e utilizável;
- [ ] CI com lint, testes e build;
- [ ] healthcheck funcional;
- [ ] logs estruturados ativos;
- [ ] sem segredos no repositório;
- [ ] documentação de integração disponível;
- [ ] critérios de aceitação validados.

# 32. Riscos e mitigação

| Risco | Impacto | Mitigação |
|---|---|---|
| Vazamento de secret HS256 | Alto | secret forte, rotação operacional e roadmap para RS256 |
| Escopos mal definidos | Médio | revisão técnica e testes de autorização |
| Falha do serviço central | Alto | healthcheck, monitoramento e estratégia de contingência |
| MFA sem recuperação no MVP | Médio | registrar limitação e planejar recovery codes |
| Crescimento de integrações sem governança | Médio | convenção de escopos e documentação obrigatória |

# 33. Estratégia de rollout

## Fase 1 — base técnica
Implementar autenticação, usuários, roles, permissions e `/auth/me`.

## Fase 2 — autorização
Aplicar RBAC em rotas críticas e validar matriz inicial de permissões.

## Fase 3 — integração
Liberar cadastro de aplicações, escopos e token de integração.

## Fase 4 — endurecimento
Ativar MFA, auditoria básica, rate limit e bloqueio por falhas.

## Fase 5 — adoção pelos squads
Migrar progressivamente módulos internos para consumo do Core.

# 34. Roadmap futuro

- logout com revogação explícita;
- recovery codes para MFA;
- auditoria avançada;
- eventos/webhooks;
- frontend administrativo;
- RS256;
- OAuth 2.0 Authorization Server;
- OpenID Connect;
- SSO corporativo;
- multi-tenant em produto ou distribuição futura separada.

# 35. Resumo executivo final

O **Core Engine & Auth** é a fundação de identidade, acesso e integração segura do ERP Modular Cloud-Native.  
Seu MVP entrega autenticação humana, MFA, RBAC, gestão de usuários/papéis/permissões, autenticação de aplicações por credenciais e escopos, documentação OpenAPI e base operacional para crescimento seguro do ecossistema.

O produto é propositalmente enxuto, porém sólido: não tenta ser uma plataforma IAM completa no MVP, mas resolve com clareza o problema central de autenticação, autorização e integração segura para uso interno e externo.