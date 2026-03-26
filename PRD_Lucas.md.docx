# Documento de Requisitos de Produto (PRD)

## [CORE-001] Core Engine & Auth

---

# 1. Visão Geral

## Problema
Sistemas modulares necessitam de uma camada central robusta de autenticação e autorização. Implementações descentralizadas geram inconsistência, vulnerabilidades e alto custo de manutenção.

## Proposta de Valor
Fornecer um serviço centralizado, escalável e seguro para:
- Autenticação
- Autorização (RBAC + escopo)
- Gestão de usuários
- Integração entre módulos via API e eventos

---

# 2. Arquitetura de Autenticação

## Estratégia
- Autenticação baseada em **JWT (Access Token)**
- Uso de **Refresh Token**
- Tokens stateless

## Estrutura do JWT
- sub (userId)
- email
- roles
- permissions
- exp
- iat
- iss

## Fluxo de Autenticação
1. Usuário realiza login
2. Sistema valida credenciais
3. Retorna:
   - access_token (curta duração)
   - refresh_token (longa duração)
4. Cliente usa access_token nas requisições
5. Ao expirar:
   - utiliza refresh_token
6. Logout:
   - invalida refresh_token

## Headers padrão
Authorization: Bearer <token>

---

# 3. Segurança

## Senhas
- Hash: **bcrypt ou argon2**
- Política:
  - mínimo 8 caracteres
  - letras + números

## Proteções
- Rate limiting (login)
- Bloqueio após tentativas falhas
- Logs de auditoria

## MFA (Opcional, recomendado)
- TOTP (Google Authenticator)

## Tokens
- Expiração configurável
- Rotação de refresh token
- Assinatura com segredo seguro (env/secret manager)

---

# 4. Modelo de Autorização

## RBAC + Escopo

### Roles
- admin
- gestor
- analista
- operador

### Permissões
Formato:
<modulo>.<acao>.<escopo>

Exemplos:
- finance.read.all
- finance.write.own

## Relacionamentos
- User -> Role (N:N)
- Role -> Permission (N:N)

---

# 5. Modelo de Dados (Entidades)

## User
- id (UUID)
- name
- email
- password_hash
- status (active, disabled)
- created_at

## Role
- id
- name

## Permission
- id
- code
- description

## UserRole
- user_id
- role_id

## RolePermission
- role_id
- permission_id

---

# 6. Requisitos Funcionais

RF01 — Cadastro de usuários
RF02 — Login com geração de token
RF03 — Refresh token
RF04 — Logout (revogação)
RF05 — Gestão de usuários
RF06 — Gestão de roles
RF07 — Gestão de permissões
RF08 — Validação de token
RF09 — Endpoint /me
RF10 — Integração com módulos

---

# 7. API (Padrão)

## Endpoints
POST /v1/auth/register
POST /v1/auth/login
POST /v1/auth/refresh
POST /v1/auth/logout
GET /v1/auth/me

## Padrão de resposta

Sucesso:
{
  "data": {},
  "meta": {}
}

Erro:
{
  "error": {
    "code": "string",
    "message": "string"
  }
}

---

# 8. Eventos e Integração

## Estratégia
- Uso de broker (ex: Kafka/RabbitMQ)
- Eventos idempotentes
- Retry automático

## Eventos
- user.created
- user.disabled
- role.updated
- permission.updated

---

# 9. Escalabilidade

- Stateless (JWT)
- Cache opcional (Redis)
- Horizontal scaling

---

# 10. Observabilidade

- Logs estruturados
- Métricas (login success/failure)
- Alertas

---

# 11. Testes

- Unitários
- Integração
- Segurança
- Carga

---

# 12. DoD (Definition of Done)

- Código revisado
- Testes implementados
- API documentada
- CI/CD ok
- Segurança validada
- Integração testada

---

# 13. User Stories

- Como admin, quero gerenciar usuários
- Como usuário, quero fazer login
- Como dev, quero integrar via API

---

# 14. Considerações Futuras

- OAuth2
- SSO
- Multi-tenant
- ABAC

