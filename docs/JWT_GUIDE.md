# Guia de Integração JWT — Consumidores Internos do Core/Auth

> **Fonte normativa:** `PRD.md` §16 e §5.7  
> **Sprint:** 3 — Tarefa 5  
> **Público-alvo:** desenvolvedores de módulos ERP que consomem o Core/Auth.

---

## 1. Por que este guia existe

O Core/Auth é a única fonte de verdade para autenticação e autorização do ecossistema. Cada módulo ERP deve:

- **Validar** o JWT recebido (assinatura + expiração + tipo) antes de processar qualquer requisição.
- **Ler** `perms` (usuários humanos) ou `scopes` (integrações M2M) do payload para tomar decisões locais de autorização.
- **Jamais** replicar ou manter sua própria matriz de permissões — ela vive exclusivamente no Core.

---

## 2. Estrutura do JWT

O Core emite dois tipos de token JWT, diferenciados pelo claim `type`.

### 2.1. Token de usuário humano (`user_access`)

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@empresa.com",
  "type": "user_access",
  "tenant_id": "00000000-0000-4000-8000-000000000001",
  "roles": ["admin", "manager"],
  "perms": ["users:write", "users:read", "roles:read"],
  "iat": 1744660800,
  "exp": 1744661700
}
```

| Claim | Tipo | Descrição |
|-------|------|-----------|
| `sub` | `string` (UUID) | ID do usuário no banco. **Equivale a `user_id`** no checklist do CTO e ao campo `userId` em `GET /v1/auth/me`. |
| `tenant_id` | `string` (UUID) | Tenant lógico do usuário (isolamento multi-tenant). **Equivale a `tenantId`** em `GET /v1/auth/me`. |
| `email` | `string` | E-mail do usuário autenticado. |
| `type` | `"user_access"` | Identifica token de usuário humano. |
| `roles` | `string[]` | Nomes dos papéis efetivos do usuário. |
| `perms` | `string[]` | Códigos de permissão efetivos (union de todos os papéis). |
| `iat` | `number` | Timestamp de emissão (segundos, Unix). |
| `exp` | `number` | Timestamp de expiração (segundos, Unix). Padrão: 15 minutos. |

### 2.2. Token de integração M2M (`integration_access`)

```json
{
  "sub": "7f3a9b2c-1234-5678-abcd-ef0123456789",
  "type": "integration_access",
  "clientId": "app_orders_service",
  "scopes": ["orders.read", "orders.write"],
  "iat": 1744660800,
  "exp": 1744664400
}
```

| Claim | Tipo | Descrição |
|-------|------|-----------|
| `sub` | `string` (UUID) | ID da Application no banco. |
| `type` | `"integration_access"` | Identifica token M2M. |
| `clientId` | `string` | Identificador público da aplicação. |
| `scopes` | `string[]` | Escopos concedidos (subconjunto do cadastrado). |
| `iat` | `number` | Timestamp de emissão (segundos, Unix). |
| `exp` | `number` | Timestamp de expiração (segundos, Unix). |

---

## 3. Como validar o token

### 3.1. Checklist de validação obrigatória

Todo módulo que recebe um JWT deve verificar, nesta ordem:

1. **Formato:** header JWT válido, três segmentos separados por `.`.
2. **Assinatura:** verificar com `HS256` usando o segredo compartilhado (`JWT_SECRET`).
3. **`exp`:** rejeitar tokens expirados. **Nunca use `ignoreExpiration: true` em produção.**
4. **`type`:** confirmar se o tipo do token é compatível com o endpoint:
   - Rotas de usuário humano: aceitar apenas `"user_access"`.
   - Rotas M2M: aceitar apenas `"integration_access"`.
5. **`perms` / `scopes`:** verificar se o token possui as permissões/escopos necessários para a operação.

### 3.2. Exemplo de validação em NestJS (reutilizando o Core)

O Core exporta `JwtAuthGuard` e `PermissionsGuard`. Módulos que usam o mesmo monorepo ou pacote compartilhado podem importá-los diretamente:

```typescript
import { JwtAuthGuard } from '@core/auth/jwt-auth.guard';
import { PermissionsGuard } from '@core/auth/guards/permissions.guard';
import { RequirePermissions } from '@core/auth/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('orders')
export class OrdersController {
  @Get()
  @RequirePermissions('orders:read')       // permissão exigida no token
  findAll(@Req() req) {
    // req.user contém: { userId, tenantId, email, roles, perms, type }
    return this.ordersService.findAll();
  }
}
```

### 3.3. Validação manual (stack não-NestJS ou serviços externos)

```typescript
import { verify } from 'jsonwebtoken';

function validateToken(token: string, secret: string) {
  // 1. Verificar assinatura e expiração
  const payload = verify(token, secret, { algorithms: ['HS256'] });
  // lança JsonWebTokenError se inválido, TokenExpiredError se expirado

  // 2. Confirmar tipo
  if (payload.type !== 'user_access') {
    throw new Error('Token type mismatch');
  }

  // 3. Verificar permissão local
  const required = 'orders:read';
  if (!payload.perms.includes(required)) {
    throw new Error('Insufficient permissions');
  }

  return payload;
}
```

```python
# Exemplo em Python (PyJWT)
import jwt

payload = jwt.decode(token, secret, algorithms=["HS256"])
# Valida exp automaticamente; lança jwt.ExpiredSignatureError se expirado

assert payload["type"] == "user_access", "Token type mismatch"
assert "orders:read" in payload["perms"], "Insufficient permissions"
```

### 3.4. Implementação de referência no repositório

O repositório Core/Auth oferece um utilitário de validação JWT reutilizável em `Backend/src/shared/utils/token.ts`.

As funções principais são:

- `validateJwtToken(token, secret, expectedType)`
- `validateUserToken(token, secret)`
- `validateM2MToken(token, secret)`
- `hasPermission(payload, requiredPermission)`
- `hasScope(payload, requiredScope)`

Esse utilitário pode ser usado como base para middleware ou snippets em Node.js, garantindo a mesma lógica de validação de token do Core.

```ts
import {
  validateUserToken,
  hasPermission,
} from '../../Backend/src/shared/utils/token';

const payload = validateUserToken(token, process.env.JWT_SECRET);
if (!hasPermission(payload, 'orders:read')) {
  throw new Error('Insufficient permissions');
}
```

---

## 4. Convenção de `permission.code`

As permissões seguem o formato `recurso:acao` (e opcionalmente `:escopo`):

```
<recurso>:<acao>[:<escopo>]
```

### 4.1. Exemplos

| `permission.code` | Significado |
|-------------------|-------------|
| `users:read` | Leitura de usuários |
| `users:write` | Criação e atualização de usuários |
| `roles:read` | Leitura de papéis |
| `roles:write` | Criação e atualização de papéis |
| `orders:read` | Leitura de pedidos (módulo Orders) |
| `orders:write` | Escrita em pedidos |
| `reports:read` | Leitura de relatórios |

### 4.2. Papéis sugeridos (seed inicial)

| Role | Permissões típicas |
|------|--------------------|
| `admin` | Acesso total a todos os recursos |
| `manager` | Leitura + escrita em recursos operacionais |
| `operator` | Operações do dia a dia (sem gestão de acesso) |
| `viewer` | Somente leitura |

---

## 5. Usando `perms` para autorização local

### Regra de ouro

> **O módulo nunca decide quais permissões o usuário tem — ele apenas verifica se o token já as carrega.**

O fluxo correto:

```
Request com Bearer token
       │
       ▼
  JwtAuthGuard  ──► valida assinatura, exp, type
       │
       ▼
PermissionsGuard ──► lê `perms` do token e compara com @RequirePermissions(...)
       │
       ▼
  Controller / Service  ──► executa regra de negócio local
```

**O que NÃO fazer:**

```typescript
// ❌ ERRADO: consultar o banco para checar permissão — duplica a lógica do Core
const user = await db.users.findById(req.user.userId);
const hasPermission = await checkUserPermissions(user.id, 'orders:write');

// ✅ CORRETO: confiar no `perms` do token
const hasPermission = req.user.perms.includes('orders:write');
```

### Por que não duplicar a matriz de permissões?

1. **Consistência:** Se o admin revogar uma permissão no Core, o token expira em até 15 minutos e o acesso é bloqueado automaticamente — sem necessidade de sincronização entre módulos.
2. **Auditabilidade:** Toda mudança de permissão está centralizada no Core com trilha de log.
3. **Manutenibilidade:** Evita divergências entre o que o Core diz e o que cada módulo "acha" que o usuário pode fazer.

---

## 6. Usando `scopes` para autorização M2M

Rotas que aceitam tokens de integração verificam `scopes` (não `perms`):

```typescript
// Decorator de escopo (análogo ao RequirePermissions)
@UseGuards(JwtAuthGuard, ScopesGuard)
@Get('orders')
@RequireScopes('orders.read')
findAll() { ... }
```

No token M2M, `scopes` é um array de strings. O guard verifica se **todos** os escopos exigidos estão presentes.

> **Implementado:** `ScopesGuard` e `@RequireScopes` estão disponíveis desde a Sprint 4 (Task 8). Consulte [`docs/SCOPES_GUARD_TEST_GUIDE.md`](SCOPES_GUARD_TEST_GUIDE.md) para o guia completo de uso.

---

## 7. Respostas de erro relacionadas ao JWT

Todos os erros seguem o envelope padrão do Core (ver `docs/INTEGRATION_API_CONTRACT.md`):

| HTTP | `error.code` | Quando ocorre |
|------|--------------|---------------|
| `401` | `AUTH_TOKEN_INVALID` | Token ausente, malformado ou assinatura inválida |
| `401` | `AUTH_TOKEN_EXPIRED` | Token com `exp` no passado |
| `401` | `AUTH_REFRESH_INVALID` | Refresh inválido/expirado ou usuário inativo |
| `401` | `AUTH_REFRESH_REUSED` | Refresh já revogado (possível race condition) |
| `403` | `AUTHZ_FORBIDDEN` | Token válido, mas sem permissão/escopo necessário |

### Exemplo de resposta 401

```json
{
  "success": false,
  "error": {
    "code": "AUTH_TOKEN_EXPIRED",
    "message": "Token has expired"
  },
  "timestamp": "2026-04-15T10:30:00.000Z",
  "path": "/v1/orders"
}
```

### Exemplo de resposta 403

```json
{
  "success": false,
  "error": {
    "code": "AUTHZ_FORBIDDEN",
    "message": "Insufficient permissions"
  },
  "timestamp": "2026-04-15T10:30:00.000Z",
  "path": "/v1/users"
}
```

---

## 8. Variáveis de ambiente necessárias

O módulo consumidor precisa do mesmo `JWT_SECRET` configurado no Core para validar a assinatura localmente:

```env
JWT_SECRET=mesmo-secret-do-core-auth
```

> **Segurança:** Nunca exponha o `JWT_SECRET` em logs, repositórios ou respostas de API. Gerencie via secret manager em produção.

---

## 9. Fluxo completo de autenticação (referência rápida)

```
1. POST /v1/auth/login  { email, password }
   └─► { accessToken, refreshToken, tokenType: "Bearer", expiresIn: 900 }

2. GET /v1/recurso  Authorization: Bearer <accessToken>
   └─► Guard valida token → retorna dado

3. POST /v1/auth/refresh  { refreshToken }
   └─► { accessToken (novo), refreshToken (novo), expiresIn: 900 }
       Token antigo é revogado imediatamente.
```

---

## 10. Referências cruzadas

| Recurso | Onde encontrar |
|---------|----------------|
| Envelope de resposta e catálogo de `error.code` | `docs/INTEGRATION_API_CONTRACT.md` |
| Guia de integração M2M (OAuth 2.0, `curl`, escopos) | `docs/M2M_INTEGRATION_GUIDE.md` |
| Guia do ScopesGuard (`@RequireScopes`) | `docs/SCOPES_GUARD_TEST_GUIDE.md` |
| Swagger interativo (ambiente dev) | `GET /v1/docs` |
| Modelo de dados (User, Role, Permission) | `PRD.md` §15 |
| Estratégia de autenticação e claims JWT | `PRD.md` §16 |
| Requisitos funcionais (RF01–RF08) | `PRD.md` §7 |
| Regras de negócio (RN01–RN08) | `PRD.md` §9 |
