# Guia de Integração — Core Engine & Auth

> **Versão:** 1.0  
> **Última atualização:** 21/05/2026  
> **Fonte normativa:** `PRD.md` (v2.0 — CORE-001)  
> **Público-alvo:** desenvolvedores e squads de módulos ERP que precisam consumir o Core Engine & Auth para autenticação, autorização (RBAC) e integração machine-to-machine (M2M).

---

## Sumário

1. [Visão geral](#1-visão-geral)
2. [Quando usar M2M vs. RBAC de usuário humano](#2-quando-usar-m2m-vs-rbac-de-usuário-humano)
3. [Fluxograma — autenticação entre módulos](#3-fluxograma--autenticação-entre-módulos)
4. [Fluxo M2M (machine-to-machine)](#4-fluxo-m2m-machine-to-machine)
5. [Fluxo de usuário humano (RBAC)](#5-fluxo-de-usuário-humano-rbac)
6. [Validação do token JWT](#6-validação-do-token-jwt)
7. [Proteção de rotas no módulo consumidor](#7-proteção-de-rotas-no-módulo-consumidor)
8. [Tratamento de erros](#8-tratamento-de-erros)
9. [Variáveis de ambiente necessárias](#9-variáveis-de-ambiente-necessárias)
10. [Checklist de onboarding para novo módulo/squad](#10-checklist-de-onboarding-para-novo-módulo--squad)
11. [Referências cruzadas](#11-referências-cruzadas)

---

## 1. Visão geral

O **Core Engine & Auth** é a fonte única de verdade para identidade, autenticação e autorização do ecossistema ERP. Ele opera em duas frentes complementares:

| Frente | Para quem | Mecanismo |
|--------|-----------|-----------|
| **RBAC de usuário humano** | Usuários logados via browser/app | JWT `type: user_access` com claims `roles` e `perms` |
| **Integração M2M** | Serviços, daemons, scripts automatizados | JWT `type: integration_access` com claim `scopes` via OAuth 2.0 `client_credentials` |

**Base URL (dev):** `http://localhost:3000` (backend direto) ou **`http://localhost`** (gateway Docker — recomendado para demo integrada)  
**Prefixo de API:** `/v1`  
**Swagger interativo:** `GET /v1/docs` (somente em ambiente de desenvolvimento)  
**Gateway multi-módulo:** ver [`docs/GATEWAY.md`](GATEWAY.md) (roteamento Core + squads 2–4, sem login duplicado)

> **Regra de ouro:** Nenhum módulo deve manter sua própria matriz de permissões ou seu próprio mecanismo de login. Toda autorização vem dos claims do JWT emitido pelo Core.

---

## 2. Quando usar M2M vs. RBAC de usuário humano

```
Há um usuário humano na sessão?
│
├─ SIM ─► Use o fluxo de usuário humano
│          • O frontend faz login via POST /v1/auth/login
│          • Envia o Bearer token (type: user_access) nas requisições
│          • O módulo verifica perms[] do JWT (RBAC)
│
└─ NÃO ─► Use o fluxo M2M
           • Serviço obtém token via POST /v1/oauth/token (client_credentials)
           • Envia o Bearer token (type: integration_access) nas requisições
           • O módulo verifica scopes[] do JWT
```

| Situação | Fluxo recomendado |
|----------|-------------------|
| Frontend administrativo → módulo de pedidos | RBAC de usuário humano |
| Serviço de relatórios → Core/Auth (leitura de usuários) | M2M (`client_credentials`) |
| Daemon de sincronização de estoque | M2M (`client_credentials`) |
| API Gateway validando sessão do usuário | Validação direta do JWT (`user_access`) |
| Webhook externo enviando eventos | M2M (`client_credentials`) |

---

## 3. Fluxograma — autenticação entre módulos

### 3.1. Fluxo de usuário humano (RBAC)

```mermaid
sequenceDiagram
    participant U as Usuário / Frontend
    participant C as Core Engine & Auth
    participant M as Módulo ERP

    U->>C: POST /v1/auth/login<br/>{ email, password }
    C-->>U: { accessToken (user_access), refreshToken }

    U->>M: GET /v1/orders<br/>Authorization: Bearer <accessToken>
    M->>M: JwtAuthGuard: valida assinatura + exp + type
    M->>M: PermissionsGuard: verifica perms[] ⊃ ["orders:read"]
    M-->>U: { success: true, data: [...] }

    Note over U,M: Quando o accessToken expirar (15 min)
    U->>C: POST /v1/auth/refresh { refreshToken }
    C-->>U: { accessToken (novo), refreshToken (novo) }
    Note over C: Token antigo é revogado imediatamente (rotação)
```

### 3.2. Fluxo M2M (integração entre serviços)

```mermaid
sequenceDiagram
    participant S as Serviço / Daemon
    participant C as Core Engine & Auth
    participant M as Módulo ERP

    S->>C: POST /v1/oauth/token<br/>{ grant_type: client_credentials,<br/>  client_id, client_secret, scope }
    C->>C: Valida credenciais da aplicação
    C->>C: Verifica escopos solicitados ⊆ escopos cadastrados
    C-->>S: { access_token (integration_access), expires_in }

    S->>M: GET /v1/products<br/>Authorization: Bearer <access_token>
    M->>M: JwtAuthGuard: valida assinatura + exp + type
    M->>M: ScopesGuard: verifica scopes[] ⊃ ["products:read"]
    M-->>S: { success: true, data: [...] }
```

### 3.3. Visão geral do ecossistema

```mermaid
graph TD
    subgraph Core["Core Engine & Auth"]
        LOGIN["POST /v1/auth/login"]
        OAUTH["POST /v1/oauth/token"]
        REFRESH["POST /v1/auth/refresh"]
    end

    subgraph Consumers["Módulos ERP Consumidores"]
        ORDERS["Módulo Orders"]
        CRM["Módulo CRM"]
        INVENTORY["Módulo Inventory"]
    end

    subgraph Actors["Atores"]
        USER["👤 Usuário Humano"]
        SVC["⚙️ Serviço / Daemon"]
    end

    USER -- "email + senha" --> LOGIN
    LOGIN -- "JWT user_access" --> USER
    USER -- "Bearer token" --> ORDERS
    USER -- "Bearer token" --> CRM

    SVC -- "client_id + client_secret" --> OAUTH
    OAUTH -- "JWT integration_access" --> SVC
    SVC -- "Bearer token" --> INVENTORY
    SVC -- "Bearer token" --> ORDERS

    ORDERS -- "valida JWT" --> Core
    CRM -- "valida JWT" --> Core
    INVENTORY -- "valida JWT" --> Core
```

---

## 4. Fluxo M2M (machine-to-machine)

### 4.1. Pré-requisitos (feitos pelo admin)

Antes de integrar, o administrador do Core Engine deve:

1. Criar uma aplicação: `POST /v1/applications` → obter `client_id` e `client_secret` (**exibido apenas uma vez**)
2. Associar escopos: `POST /v1/applications/:id/scopes` → informar quais `scopeCodes` a aplicação pode usar
3. Repassar ao squad integrador: `client_id`, `client_secret` e lista de escopos liberados

> ⚠️ **Segurança:** O `client_secret` nunca é exibido novamente após a criação. Guarde-o em um secret manager imediatamente.

### 4.2. Obtendo o token M2M

#### cURL

```bash
curl -X POST http://localhost:3000/v1/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "meu_client_id",
    "client_secret": "meu_client_secret",
    "scope": "orders:read orders:write"
  }'
```

#### Node.js (fetch nativo / Node 18+)

```javascript
async function getM2MToken() {
  const response = await fetch('http://localhost:3000/v1/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.CORE_CLIENT_ID,
      client_secret: process.env.CORE_CLIENT_SECRET,
      scope: 'orders:read orders:write',
    }),
  });

  const body = await response.json();
  if (!body.success) throw new Error(`Token error: ${body.error.code}`);

  return body.data; // { access_token, token_type, expires_in, scope }
}
```

#### Node.js (axios)

```javascript
const axios = require('axios');

async function getM2MToken() {
  const { data: body } = await axios.post(
    'http://localhost:3000/v1/oauth/token',
    {
      grant_type: 'client_credentials',
      client_id: process.env.CORE_CLIENT_ID,
      client_secret: process.env.CORE_CLIENT_SECRET,
      scope: 'orders:read orders:write',
    }
  );

  if (!body.success) throw new Error(`Token error: ${body.error.code}`);
  return body.data; // { access_token, token_type, expires_in, scope }
}
```

#### Python (requests)

```python
import os
import requests

def get_m2m_token() -> dict:
    response = requests.post(
        "http://localhost:3000/v1/oauth/token",
        json={
            "grant_type": "client_credentials",
            "client_id": os.environ["CORE_CLIENT_ID"],
            "client_secret": os.environ["CORE_CLIENT_SECRET"],
            "scope": "orders:read orders:write",
        },
        timeout=10,
    )
    response.raise_for_status()
    body = response.json()

    if not body["success"]:
        raise RuntimeError(f"Token error: {body['error']['code']}")

    return body["data"]  # { access_token, token_type, expires_in, scope }
```

### 4.3. Resposta de sucesso

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 900,
    "scope": "orders:read orders:write"
  },
  "timestamp": "2026-05-21T23:00:00.000Z",
  "path": "/v1/oauth/token"
}
```

| Campo | Descrição |
|-------|-----------|
| `data.access_token` | JWT M2M — use no header `Authorization: Bearer <token>` |
| `data.token_type` | Sempre `"Bearer"` |
| `data.expires_in` | TTL em segundos (padrão: 900 = 15 minutos) |
| `data.scope` | Escopos efetivamente concedidos |

### 4.4. Usando o token em chamadas ao módulo consumidor

#### cURL

```bash
curl -X GET http://localhost:3001/v1/orders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Node.js (fetch nativo)

```javascript
async function fetchOrders(accessToken) {
  const response = await fetch('http://localhost:3001/v1/orders', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const body = await response.json();
  if (!body.success) throw new Error(`API error: ${body.error.code}`);
  return body.data;
}
```

#### Python (requests)

```python
def fetch_orders(access_token: str) -> list:
    response = requests.get(
        "http://localhost:3001/v1/orders",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=10,
    )
    response.raise_for_status()
    body = response.json()

    if not body["success"]:
        raise RuntimeError(f"API error: {body['error']['code']}")

    return body["data"]
```

### 4.5. Payload do JWT M2M (decodificado)

```json
{
  "sub": "7f3a9b2c-1234-5678-abcd-ef0123456789",
  "type": "integration_access",
  "clientId": "meu_client_id",
  "scopes": ["orders:read", "orders:write"],
  "iat": 1716332400,
  "exp": 1716333300
}
```

| Claim | Descrição |
|-------|-----------|
| `sub` | UUID da Application no banco |
| `type` | Sempre `"integration_access"` — use para distinguir do token humano |
| `clientId` | Identificador público da aplicação |
| `scopes` | Escopos concedidos neste token |

### 4.6. Consulta de identidade por UUID (RF29)

Squads **2** (emitente na emissão fiscal) e **3** (nome do usuário logado) devem buscar dados de identidade **no Core**, não no banco do Core.

| Item | Valor |
|------|--------|
| **Rota** | `GET /v1/integration/users/:id` |
| **Token** | `integration_access` (não aceita token humano) |
| **Escopo mínimo** | `identity:read` |
| **K8s (exemplo)** | `http://core-engine-svc.default.svc.cluster.local:8080/v1/integration/users/{uuid}` |

#### cURL

```bash
# 1) Obter token M2M com escopo identity:read
TOKEN=$(curl -s -X POST http://localhost:3000/v1/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "test-client-id",
    "client_secret": "test-client-secret",
    "scope": "identity:read"
  }' | jq -r '.data.access_token')

# 2) Buscar usuário pelo UUID (sub do JWT humano no CRM)
curl -s http://localhost:3000/v1/integration/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Id: 00000000-0000-4000-8000-000000000001"
```

#### Resposta (200)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "crm@example.com",
    "name": "CRM",
    "status": "ACTIVE",
    "createdAt": "2026-05-01T10:00:00.000Z",
    "updatedAt": "2026-05-01T10:00:00.000Z"
  },
  "timestamp": "2026-05-27T12:00:00.000Z",
  "path": "/v1/integration/users/550e8400-e29b-41d4-a716-446655440000"
}
```

> **Nota:** `GET /v1/users/:id` permanece para administradores humanos com permissão RBAC `users:read`. Serviços M2M devem usar **`/v1/integration/users/:id`**.

### 4.7. Escopos disponíveis

| Escopo | Descrição | Módulo-alvo |
|--------|-----------|-------------|
| `orders:read` | Leitura de pedidos | Vendas/Logística |
| `orders:write` | Criação e atualização de pedidos | Vendas/Logística |
| `customers:read` | Leitura de clientes | CRM |
| `customers:write` | Criação e atualização de clientes | CRM |
| `products:read` | Leitura de catálogo de produtos | Catálogo |
| `products:write` | Gerenciamento de produtos | Catálogo |
| `identity:read` | Leitura de identidade de usuários (`GET /v1/integration/users/:id`) | Core/Auth |
| `read:all` | Leitura global em todas as APIs permitidas | Global |
| `write:all` | Escrita global em todas as APIs permitidas | Global |

> Para solicitar um novo escopo, abra um PR no repositório `erp-core-auth` e atualize `prisma/seed.ts` + `docs/PERMISSIONS_MATRIX.md`.

---

## 5. Fluxo de usuário humano (RBAC)

### 5.1. Login e obtenção do token

#### cURL

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@empresa.com",
    "password": "MinhaSenh@Forte123"
  }'
```

#### Node.js (fetch nativo)

```javascript
async function login(email, password) {
  const response = await fetch('http://localhost:3000/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const body = await response.json();
  if (!body.success) throw new Error(`Login error: ${body.error.code}`);

  // Armazene refreshToken de forma segura (httpOnly cookie recomendado)
  return body.data; // { accessToken, refreshToken, tokenType, expiresIn }
}
```

#### Python (requests)

```python
def login(email: str, password: str) -> dict:
    response = requests.post(
        "http://localhost:3000/v1/auth/login",
        json={"email": email, "password": password},
        timeout=10,
    )
    response.raise_for_status()
    body = response.json()

    if not body["success"]:
        raise RuntimeError(f"Login error: {body['error']['code']}")

    return body["data"]  # { accessToken, refreshToken, tokenType, expiresIn }
```

### 5.2. Resposta de sucesso do login

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g...",
    "tokenType": "Bearer",
    "expiresIn": 900
  },
  "timestamp": "2026-05-21T23:00:00.000Z",
  "path": "/v1/auth/login"
}
```

### 5.3. Contexto de tenant (`X-Tenant-Id`) — RF27

Rotas administrativas do Core (ex.: `GET /v1/users`) filtram dados pelo **tenant** do token. Squads que chamam o Core em nome de um usuário humano devem propagar o mesmo contexto:

| Cenário | Header `X-Tenant-Id` | Comportamento |
|---------|----------------------|---------------|
| Omitido | — | O Core usa o `tenant_id` do JWT (`user_access`). |
| Presente e igual ao JWT | UUID do tenant | Aceito; reforça o contexto para gateways e logs. |
| Presente e diferente do JWT | UUID divergente | **403** `TENANT_MISMATCH`. |
| Token M2M em `GET /v1/integration/users/:id` | **Obrigatório** | Sem header → **400** `TENANT_HEADER_REQUIRED`. |

**Exemplo — listar usuários (admin):**

```bash
curl -X GET "http://localhost:3000/v1/users?page=1&limit=10" \
  -H "Authorization: Bearer <accessToken>" \
  -H "X-Tenant-Id: 00000000-0000-4000-8000-000000000001"
```

**Exemplo — identidade M2M (Squad 2/3):**

```bash
curl -X GET "http://localhost:3000/v1/integration/users/<user-uuid>" \
  -H "Authorization: Bearer <integration_access_token>" \
  -H "X-Tenant-Id: 00000000-0000-4000-8000-000000000001"
```

> O UUID do tenant default de demonstração está no seed (`prisma/seed.ts`) e em `docs/JWT_GUIDE.md` (claim `tenant_id`).

### 5.4. Obtendo o perfil e permissões do usuário

```bash
curl -X GET http://localhost:3000/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@empresa.com",
    "name": "Admin ERP",
    "status": "ACTIVE",
    "roles": ["admin"],
    "permissions": ["users:read", "users:write", "orders:read", "orders:write"]
  }
}
```

### 5.5. Renovação do token (refresh com rotação)

O `accessToken` expira em **15 minutos** por padrão. Implemente renovação proativa antes do vencimento.

#### cURL

```bash
curl -X POST http://localhost:3000/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{ "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g..." }'
```

#### Node.js

```javascript
async function refreshTokens(refreshToken) {
  const response = await fetch('http://localhost:3000/v1/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const body = await response.json();
  if (!body.success) throw new Error(`Refresh error: ${body.error.code}`);

  // ⚠️ Descarte o refreshToken anterior — ele foi revogado
  return body.data; // { accessToken (novo), refreshToken (novo), expiresIn }
}
```

> ⚠️ **Rotação obrigatória:** Após cada `POST /v1/auth/refresh`, o refresh token anterior é **imediatamente revogado**. Sempre use o token mais recente retornado.

### 5.5. Payload do JWT de usuário (decodificado)

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@empresa.com",
  "type": "user_access",
  "roles": ["admin"],
  "perms": ["users:read", "users:write", "orders:read", "orders:write"],
  "iat": 1716332400,
  "exp": 1716333300
}
```

| Claim | Descrição |
|-------|-----------|
| `sub` | UUID do usuário no banco |
| `email` | E-mail do usuário autenticado |
| `type` | Sempre `"user_access"` para usuários humanos |
| `roles` | Papéis efetivos (ex.: `["admin", "manager"]`) |
| `perms` | Permissões efetivas — union de todos os papéis atribuídos |

### 5.6. Papéis e permissões disponíveis

| Papel | Descrição | Permissões |
|-------|-----------|------------|
| `admin` | Administrador total | Todas as permissões |
| `manager` | Gestor de negócio | Leituras IAM + escrita/leitura de domínios |
| `viewer` | Somente leitura | Todas as permissões `:read` |

Para a lista completa de `permission.code`, consulte [`docs/PERMISSIONS_MATRIX.md`](PERMISSIONS_MATRIX.md).

---

## 6. Validação do token JWT

### 6.1. Checklist obrigatório

Todo módulo que recebe um JWT **deve** verificar, nesta ordem:

1. ✅ **Formato:** três segmentos separados por `.` (header.payload.signature)
2. ✅ **Assinatura:** HS256 com o `JWT_SECRET` compartilhado
3. ✅ **`exp`:** rejeitar tokens expirados — **nunca use `ignoreExpiration: true` em produção**
4. ✅ **`type`:** confirmar compatibilidade com o endpoint
   - Rotas de usuário: aceitar apenas `"user_access"`
   - Rotas M2M: aceitar apenas `"integration_access"`
5. ✅ **`perms` / `scopes`:** verificar se o token possui o acesso necessário para a operação

### 6.2. Validação em Node.js (jsonwebtoken)

```javascript
const jwt = require('jsonwebtoken');

function validateUserToken(token) {
  // 1. Verifica assinatura + exp automaticamente
  const payload = jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256'],
  });
  // Lança JsonWebTokenError se inválido, TokenExpiredError se expirado

  // 2. Confirma o tipo
  if (payload.type !== 'user_access') {
    throw new Error('Token type mismatch: expected user_access');
  }

  return payload;
  // payload.sub    → ID do usuário
  // payload.email  → e-mail
  // payload.roles  → ["admin", ...]
  // payload.perms  → ["orders:read", ...]
}

function validateM2MToken(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256'],
  });

  if (payload.type !== 'integration_access') {
    throw new Error('Token type mismatch: expected integration_access');
  }

  return payload;
  // payload.sub      → ID da Application
  // payload.clientId → identificador público
  // payload.scopes   → ["orders:read", ...]
}

// Verificar permissão local (RBAC)
function hasPermission(payload, requiredPerm) {
  return Array.isArray(payload.perms) && payload.perms.includes(requiredPerm);
}

// Verificar escopo local (M2M)
function hasScope(payload, requiredScope) {
  return Array.isArray(payload.scopes) && payload.scopes.includes(requiredScope);
}
```

### 6.3. Validação em Python (PyJWT)

```python
import os
import jwt  # pip install PyJWT

JWT_SECRET = os.environ["JWT_SECRET"]

def validate_user_token(token: str) -> dict:
    """Valida assinatura, expiração e tipo do token de usuário humano."""
    payload = jwt.decode(
        token,
        JWT_SECRET,
        algorithms=["HS256"],
        # jwt.ExpiredSignatureError se expirado
        # jwt.InvalidSignatureError se assinatura inválida
    )

    if payload.get("type") != "user_access":
        raise ValueError("Token type mismatch: expected user_access")

    return payload
    # payload["sub"]   → ID do usuário (UUID)
    # payload["email"] → e-mail
    # payload["roles"] → ["admin", ...]
    # payload["perms"] → ["orders:read", ...]


def validate_m2m_token(token: str) -> dict:
    """Valida assinatura, expiração e tipo do token M2M."""
    payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

    if payload.get("type") != "integration_access":
        raise ValueError("Token type mismatch: expected integration_access")

    return payload
    # payload["sub"]      → ID da Application (UUID)
    # payload["clientId"] → identificador público
    # payload["scopes"]   → ["orders:read", ...]


def has_permission(payload: dict, required_perm: str) -> bool:
    """Verifica se o token de usuário possui a permissão necessária."""
    return required_perm in payload.get("perms", [])


def has_scope(payload: dict, required_scope: str) -> bool:
    """Verifica se o token M2M possui o escopo necessário."""
    return required_scope in payload.get("scopes", [])
```

### 6.4. Middleware Express (Node.js) — exemplo completo

```javascript
const jwt = require('jsonwebtoken');

/**
 * Middleware que valida o JWT e injeta o payload em req.auth
 * Uso: router.get('/orders', requireAuth('user_access'), ...)
 */
function requireAuth(expectedType = 'user_access') {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_TOKEN_INVALID', message: 'Missing Bearer token' },
      });
    }

    const token = authHeader.slice(7);
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ['HS256'],
      });

      if (payload.type !== expectedType) {
        return res.status(401).json({
          success: false,
          error: { code: 'AUTH_TOKEN_INVALID', message: `Expected type ${expectedType}` },
        });
      }

      req.auth = payload;
      next();
    } catch (err) {
      const code = err.name === 'TokenExpiredError'
        ? 'AUTH_TOKEN_EXPIRED'
        : 'AUTH_TOKEN_INVALID';

      return res.status(401).json({
        success: false,
        error: { code, message: err.message },
      });
    }
  };
}

/**
 * Middleware que verifica permissão RBAC (usuário humano)
 * Uso: router.get('/orders', requireAuth(), requirePerm('orders:read'), ...)
 */
function requirePerm(permission) {
  return (req, res, next) => {
    if (!req.auth?.perms?.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTHZ_FORBIDDEN', message: `Required permission: ${permission}` },
      });
    }
    next();
  };
}

/**
 * Middleware que verifica escopo M2M
 * Uso: router.get('/products', requireAuth('integration_access'), requireScope('products:read'), ...)
 */
function requireScope(scope) {
  return (req, res, next) => {
    if (!req.auth?.scopes?.includes(scope)) {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTHZ_FORBIDDEN', message: `Required scope: ${scope}` },
      });
    }
    next();
  };
}

module.exports = { requireAuth, requirePerm, requireScope };
```

**Uso no roteador:**

```javascript
const { requireAuth, requirePerm, requireScope } = require('./auth-middleware');

// Rota protegida por usuário humano com RBAC
router.get('/orders', requireAuth('user_access'), requirePerm('orders:read'), (req, res) => {
  // req.auth.sub    → userId
  // req.auth.email  → email
  // req.auth.perms  → ["orders:read", ...]
  res.json({ success: true, data: [] });
});

// Rota protegida por token M2M
router.post('/sync/inventory', requireAuth('integration_access'), requireScope('inventory:write'), (req, res) => {
  // req.auth.clientId → "meu_client_id"
  // req.auth.scopes   → ["inventory:write"]
  res.json({ success: true, data: { synced: true } });
});
```

### 6.5. FastAPI (Python) — exemplo completo

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os

app = FastAPI()
security = HTTPBearer()
JWT_SECRET = os.environ["JWT_SECRET"]


def get_token_payload(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    expected_type: str = "user_access",
) -> dict:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "AUTH_TOKEN_EXPIRED", "message": "Token has expired"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "AUTH_TOKEN_INVALID", "message": "Invalid token"},
        )

    if payload.get("type") != expected_type:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "AUTH_TOKEN_INVALID", "message": f"Expected type {expected_type}"},
        )

    return payload


def require_user_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    return get_token_payload(credentials, expected_type="user_access")


def require_m2m_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    return get_token_payload(credentials, expected_type="integration_access")


# Rota protegida por usuário humano
@app.get("/v1/orders")
def list_orders(auth: dict = Depends(require_user_token)):
    if "orders:read" not in auth.get("perms", []):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "AUTHZ_FORBIDDEN", "message": "Required permission: orders:read"},
        )
    return {"success": True, "data": []}


# Rota protegida por token M2M
@app.post("/v1/sync/inventory")
def sync_inventory(auth: dict = Depends(require_m2m_token)):
    if "inventory:write" not in auth.get("scopes", []):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "AUTHZ_FORBIDDEN", "message": "Required scope: inventory:write"},
        )
    return {"success": True, "data": {"synced": True}}
```

---

## 7. Proteção de rotas no módulo consumidor

### 7.1. NestJS — usando guards do Core (monorepo)

Módulos no mesmo monorepo ou que compartilham o pacote `@core/auth` podem importar os guards diretamente:

```typescript
import { JwtAuthGuard } from '@core/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '@core/auth/guards/permissions.guard';
import { ScopesGuard } from '@core/auth/guards/scopes.guard';
import { RequirePermissions } from '@core/auth/decorators/require-permissions.decorator';
import { RequireScopes } from '@core/auth/decorators/require-scopes.decorator';

// Rota de usuário humano (RBAC)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Get('orders')
@RequirePermissions('orders:read')
findAll(@Req() req) {
  // req.user → { sub, email, roles, perms, type }
  return this.ordersService.findAll();
}

// Rota M2M (escopos)
@UseGuards(JwtAuthGuard, ScopesGuard)
@Post('sync')
@RequireScopes('inventory:write')
syncInventory(@Req() req) {
  // req.user → { sub, clientId, scopes, type }
  return this.inventoryService.sync();
}
```

### 7.2. NestJS — implementação própria (serviços independentes)

Para módulos fora do monorepo, implemente a validação diretamente com `@nestjs/jwt`:

```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LocalJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader: string = request.headers.authorization ?? '';

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException({ code: 'AUTH_TOKEN_INVALID' });
    }

    const token = authHeader.slice(7);
    try {
      // JwtService já valida assinatura + exp
      request.user = this.jwtService.verify(token, {
        algorithms: ['HS256'],
        secret: process.env.JWT_SECRET,
      });
      return true;
    } catch {
      throw new UnauthorizedException({ code: 'AUTH_TOKEN_EXPIRED' });
    }
  }
}
```

### 7.3. O que NÃO fazer

```typescript
// ❌ ERRADO: consultar o banco para checar permissão — duplica a lógica do Core
const user = await this.usersService.findById(req.user.sub);
const hasPermission = user.roles.some(r => r.permissions.includes('orders:write'));

// ✅ CORRETO: confiar exclusivamente no payload do JWT
const hasPermission = req.user.perms.includes('orders:write');
```

> **Por que não duplicar?** O access token expira em até 15 minutos. Quando um admin revoga uma permissão no Core, ela para de funcionar automaticamente na próxima expiração — sem nenhuma sincronização entre módulos.

---

## 8. Tratamento de erros

Todos os erros seguem o envelope padrão do Core Engine:

```json
{
  "success": false,
  "error": {
    "code": "CÓDIGO_DO_ERRO",
    "message": "Descrição legível do erro"
  },
  "timestamp": "2026-05-21T23:00:00.000Z",
  "path": "/v1/rota-que-falhou"
}
```

### 8.1. Catálogo de erros relevantes

| HTTP | `error.code` | Quando ocorre | Como resolver |
|------|-------------|---------------|---------------|
| `400` | `VALIDATION_ERROR` | Payload com campo ausente ou tipo errado | Revise o corpo da requisição |
| `401` | `AUTH_INVALID_CREDENTIALS` | E-mail ou senha incorretos no login | Verifique as credenciais |
| `401` | `AUTH_TOKEN_INVALID` | Token ausente, malformado ou assinatura inválida | Solicite novo login ou token M2M |
| `401` | `AUTH_TOKEN_EXPIRED` | Token com `exp` no passado | Faça refresh (usuário) ou obtenha novo token M2M |
| `401` | `AUTH_REFRESH_INVALID` | Refresh inválido, expirado ou usuário inativo | Peça novo login |
| `401` | `AUTH_REFRESH_REUSED` | Refresh token já foi usado (rotação violada) | Nunca reutilize refresh tokens anteriores |
| `401` | `AUTH_INVALID_CLIENT` | `client_id` ou `client_secret` incorretos / app inativa | Confirme credenciais com o admin |
| `401` | `AUTH_INVALID_SCOPE` | Escopo solicitado não associado à aplicação | Solicite ao admin associar o escopo |
| `403` | `AUTHZ_FORBIDDEN` | Token válido, mas sem permissão/escopo necessário | Ajuste os papéis ou escopos da aplicação |
| `409` | `RESOURCE_CONFLICT` | E-mail ou `client_id` duplicado | Use identificadores únicos |
| `429` | `RATE_LIMIT_EXCEEDED` | Muitas tentativas de login em curto período | Aguarde 30 minutos ou use backoff exponencial |
| `500` | `INTERNAL_ERROR` | Erro interno no Core | Tente novamente; se persistir, contate o suporte |

### 8.2. Tratamento em Node.js

```javascript
async function callCoreApi(url, options) {
  const response = await fetch(url, options);
  const body = await response.json();

  if (!body.success) {
    const { code, message } = body.error;

    switch (code) {
      case 'AUTH_TOKEN_EXPIRED':
        // Tente renovar o token antes de retentar
        throw new TokenExpiredError(message);

      case 'AUTHZ_FORBIDDEN':
        // O usuário/serviço não tem permissão — não adianta retentar
        throw new ForbiddenError(message);

      case 'RATE_LIMIT_EXCEEDED':
        // Aguarde antes de retentar
        throw new RateLimitError(message);

      default:
        throw new ApiError(code, message);
    }
  }

  return body.data;
}
```

### 8.3. Tratamento em Python

```python
class CoreApiError(Exception):
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message
        super().__init__(f"[{code}] {message}")


def call_core_api(url: str, **kwargs) -> dict:
    response = requests.request(url=url, timeout=10, **kwargs)
    body = response.json()

    if not body["success"]:
        code = body["error"]["code"]
        message = body["error"]["message"]

        if code == "AUTH_TOKEN_EXPIRED":
            raise CoreApiError(code, "Token expirado — renove antes de retentar")
        elif code == "AUTHZ_FORBIDDEN":
            raise CoreApiError(code, "Sem permissão/escopo necessário")
        elif code == "RATE_LIMIT_EXCEEDED":
            raise CoreApiError(code, "Rate limit atingido — aguarde 30 min")
        else:
            raise CoreApiError(code, message)

    return body["data"]
```

---

## 9. Variáveis de ambiente necessárias

O módulo consumidor precisa das seguintes variáveis configuradas:

```env
# ── Compartilhadas com o Core (obrigatório para validação local de JWT) ──
JWT_SECRET=mesmo-secret-configurado-no-core-auth

# ── Apenas para fluxo M2M ──
CORE_CLIENT_ID=client_id_da_sua_aplicacao
CORE_CLIENT_SECRET=client_secret_da_sua_aplicacao

# ── URL base do Core ──
CORE_AUTH_BASE_URL=http://core-auth:3000   # produção (nome do serviço Docker)
# CORE_AUTH_BASE_URL=http://localhost:3000  # desenvolvimento local
```

> ⚠️ **Segurança:** Nunca versione esses valores no repositório. Use `.env.example` para documentar as variáveis e um secret manager para os valores reais em produção.

---

## 10. Checklist de onboarding para novo módulo / squad

Use este checklist ao integrar um novo módulo ao ecossistema Core Engine & Auth:

### Antes de começar

- [ ] Solicitar ao admin do Core a criação da Application M2M (se necessário)
- [ ] Receber e armazenar com segurança: `client_id`, `client_secret` e lista de escopos liberados
- [ ] Confirmar o `JWT_SECRET` compartilhado com a equipe do Core (via secret manager)
- [ ] Adicionar as variáveis de ambiente no `.env.example` do seu módulo (sem valores reais)

### Implementação

- [ ] Implementar validação de JWT (assinatura + exp + type) — **não use `ignoreExpiration: true`**
- [ ] Distinguir token `user_access` de `integration_access` pelo claim `type`
- [ ] Para rotas de usuário humano: verificar `perms[]` no payload do token
- [ ] Para rotas M2M: verificar `scopes[]` no payload do token
- [ ] **Não** consultar o banco do Core para checar permissões — confie no token
- [ ] **Não** criar sua própria matriz de permissões ou login separado

### Testes

- [ ] Testar fluxo com token válido → resposta esperada
- [ ] Testar com token expirado → `401 AUTH_TOKEN_EXPIRED`
- [ ] Testar com token de tipo errado → `401 AUTH_TOKEN_INVALID`
- [ ] Testar com permissão/escopo insuficiente → `403 AUTHZ_FORBIDDEN`
- [ ] Testar sem header Authorization → `401 AUTH_TOKEN_INVALID`

### Solicitar novos escopos ou permissões

- [ ] Abrir PR no repositório `erp-core-auth`
- [ ] Adicionar o novo `permission.code` ou `scope.code` em `prisma/seed.ts`
- [ ] Atualizar `docs/PERMISSIONS_MATRIX.md` com a nova entrada
- [ ] Documentar o módulo-alvo e o uso previsto

---

## 11. Referências cruzadas

| Recurso | Onde encontrar |
|---------|----------------|
| Swagger UI interativo | `GET /v1/docs` (ambiente dev) |
| Guia completo de integração M2M (OAuth 2.0, exemplos `curl`) | [`docs/M2M_INTEGRATION_GUIDE.md`](M2M_INTEGRATION_GUIDE.md) |
| Claims JWT, validação e uso de `perms`/`scopes` | [`docs/JWT_GUIDE.md`](JWT_GUIDE.md) |
| Envelope de resposta e catálogo completo de `error.code` | [`docs/INTEGRATION_API_CONTRACT.md`](INTEGRATION_API_CONTRACT.md) |
| Guia de testes do `ScopesGuard` (`@RequireScopes`) | [`docs/SCOPES_GUARD_TEST_GUIDE.md`](SCOPES_GUARD_TEST_GUIDE.md) |
| Catálogo de permissões e escopos (RBAC + M2M) | [`docs/PERMISSIONS_MATRIX.md`](PERMISSIONS_MATRIX.md) |
| Requisitos funcionais (RF17–RF24) e não funcionais | `PRD.md` §7 e §8 |
| Modelo de dados (User, Role, Permission, Application, Scope) | `PRD.md` §15 |
| Estratégia de autenticação e claims JWT | `PRD.md` §16 |
| RFC 6749 — OAuth 2.0 Authorization Framework | [tools.ietf.org/html/rfc6749](https://tools.ietf.org/html/rfc6749) |
