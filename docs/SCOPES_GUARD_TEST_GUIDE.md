# Guia de Testes — Sprint 4 Task 8: ScopesGuard e Validação de Escopos M2M

**Funcionalidade:** JWT Integration e `ScopesGuard` (RF18, CA07)  
**Endpoint de referência:** `GET /v1/integration/test-scope`  
**Pré-requisito:** Aplicação rodando localmente com banco de dados e seed executados.

---

## 1. O que foi implementado

| Artefato | Arquivo | Descrição |
|---|---|---|
| Decorador | `src/modules/auth/decorators/require-scopes.decorator.ts` | `@RequireScopes('escopo1', 'escopo2')` — declara os escopos mínimos de uma rota |
| Guard | `src/modules/auth/guards/scopes.guard.ts` | Valida os escopos do token M2M após `JwtAuthGuard` |
| Registro | `src/modules/auth/auth.module.ts` | `ScopesGuard` exportado pelo `AuthModule` |
| Rota de exemplo | `src/modules/integration/integration.controller.ts` | `GET /v1/integration/test-scope` protegida por `test:scope` |
| Testes unitários | `src/modules/auth/guards/scopes.guard.spec.ts` | 7 cenários unitários |
| Testes E2E | `test/integration.e2e.spec.ts` | 7 testes E2E incluindo os 3 de validação de escopos |

---

## 2. Executar os testes automatizados

### Testes unitários do guard

```bash
npx vitest run src/modules/auth/guards/scopes.guard.spec.ts
```

**Resultado esperado:** 7 testes passando.

### Testes E2E completos de integração

```bash
npx vitest run test/integration.e2e.spec.ts
```

**Resultado esperado:** 7 testes passando, cobrindo:
- `POST /v1/oauth/token` (JSON e `x-www-form-urlencoded`)
- `POST /v1/integration/token` (alias)
- Credenciais inválidas → 401
- Acesso com escopo correto → 200
- Acesso sem o escopo → 403
- Acesso sem token → 401

---

## 3. Teste manual via Swagger UI

Acesse `http://localhost:3000/v1/docs` com a aplicação rodando.

### Passo 1 — Criar uma aplicação e associar um escopo

> Se você já tem dados no banco, pode pular para o Passo 3.

1. Fazer login como admin em `POST /v1/auth/login`:
   ```json
   { "email": "admin@erp.com", "password": "Admin@123456" }
   ```
   Copie o `access_token` retornado em `data.access_token`.

2. Clique em **Authorize** no Swagger e cole o token.

3. Crie uma aplicação em `POST /v1/applications`:
   ```json
   { "name": "Minha Integração" }
   ```
   Copie o `clientId` e o `clientSecret` (exibido apenas uma vez!).

4. Crie um escopo global em `POST /v1/scopes` (se não existir):
   ```json
   { "code": "test:scope", "description": "Escopo de teste" }
   ```

5. Associe o escopo à aplicação em `POST /v1/applications/{id}/scopes`:
   ```json
   { "scopeCodes": ["test:scope"] }
   ```

---

### Passo 2 — Obter token M2M com `test:scope`

Use `POST /v1/oauth/token` no Swagger:

```json
{
  "grant_type": "client_credentials",
  "client_id": "SEU_CLIENT_ID",
  "client_secret": "SEU_CLIENT_SECRET",
  "scope": "test:scope"
}
```

**Resposta esperada (200):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "token_type": "Bearer",
    "expires_in": 900,
    "scope": "test:scope"
  }
}
```

Copie o `data.access_token`.

---

### Passo 3 — Cenário de Sucesso (200): Token com o escopo correto

1. No Swagger, clique em **Authorize** e cole o token M2M.
2. Execute `GET /v1/integration/test-scope`.

**Resposta esperada (200):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "You have the required scope!"
  }
}
```

---

### Passo 4 — Cenário de Falha (403): Token sem o escopo

1. Repita o Passo 2 **sem** informar o campo `scope` (ou com outro escopo):
   ```json
   {
     "grant_type": "client_credentials",
     "client_id": "SEU_CLIENT_ID",
     "client_secret": "SEU_CLIENT_SECRET"
   }
   ```
2. Copie o novo `data.access_token` e authorize no Swagger.
3. Execute `GET /v1/integration/test-scope`.

**Resposta esperada (403):**
```json
{
  "success": false,
  "error": {
    "code": "AUTHZ_FORBIDDEN",
    "message": "Insufficient scopes. Required: test:scope"
  }
}
```

---

### Passo 5 — Cenário de Falha (401): Sem token

1. Remova a autorização no Swagger (clique em **Authorize** → **Logout**).
2. Execute `GET /v1/integration/test-scope`.

**Resposta esperada (401):**
```json
{
  "success": false,
  "error": {
    "code": "AUTH_TOKEN_INVALID",
    "message": "Unauthorized"
  }
}
```

---

## 4. Teste via `curl`

### Token com escopo

```bash
# 1. Obter token
TOKEN=$(curl -s -X POST http://localhost:3000/v1/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "SEU_CLIENT_ID",
    "client_secret": "SEU_CLIENT_SECRET",
    "scope": "test:scope"
  }' | jq -r '.data.access_token')

echo "Token: $TOKEN"

# 2. Chamar rota protegida (esperado: 200)
curl -s -X GET http://localhost:3000/v1/integration/test-scope \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Token sem escopo (esperado: 403)

```bash
# Token sem scope
TOKEN_SEM_ESCOPO=$(curl -s -X POST http://localhost:3000/v1/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "SEU_CLIENT_ID_SEM_ESCOPO",
    "client_secret": "SEU_CLIENT_SECRET"
  }' | jq -r '.data.access_token')

# Chamar rota protegida (esperado: 403 AUTHZ_FORBIDDEN)
curl -s -X GET http://localhost:3000/v1/integration/test-scope \
  -H "Authorization: Bearer $TOKEN_SEM_ESCOPO" | jq .
```

---

## 5. Como aplicar `@RequireScopes` em novas rotas

Para proteger qualquer rota que deva exigir escopos M2M, use a combinação:

```typescript
import { UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ScopesGuard } from '../auth/guards/scopes.guard';
import { RequireScopes } from '../auth/decorators/require-scopes.decorator';

@Get('pedidos')
@UseGuards(JwtAuthGuard, ScopesGuard)
@RequireScopes('orders:read')
async listarPedidos() {
  // ...
}
```

> **Importante:** A ordem dos guards importa. `JwtAuthGuard` deve sempre vir **antes** de `ScopesGuard` para garantir que o token seja validado e o usuário populado no request antes da verificação de escopos.

---

## 6. Comportamento por tipo de token

| Tipo de Token | Guard aplicado | Resultado |
|---|---|---|
| `user_access` (humano) | `ScopesGuard` passa para `PermissionsGuard` | ✅ Acesso permitido (escopo ignorado; RBAC controla) |
| `integration_access` (M2M) | `ScopesGuard` valida escopos | ✅/❌ Depende dos escopos do token |
| Token inválido / sem token | `JwtAuthGuard` bloqueia | ❌ 401 Unauthorized |

---

*Guia de testes gerado para a Sprint 4, Task 8 do projeto ERP Core Auth.*
