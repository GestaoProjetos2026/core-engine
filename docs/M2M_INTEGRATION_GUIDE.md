# Guia de Integração M2M — Core Engine & Auth

> **Versão:** 1.0  
> **Fonte normativa:** `PRD.md` §5.2, §14.5, §16.2, RF17, RF21, RF22, RF23  
> **Público-alvo:** desenvolvedores e equipes de sistemas parceiros que precisam integrar via Machine-to-Machine (M2M) com o Core Engine & Auth.

---

## Visão geral

O Core Engine & Auth implementa o **OAuth 2.0 Authorization Server** (RFC 6749) para integrações machine-to-machine (M2M). Sistemas externos ou serviços internos do ERP podem obter tokens de acesso utilizando **credenciais de aplicação** (`client_id` + `client_secret`) sem envolver usuário humano no fluxo.

**Base URL:** `http://localhost:3000` (desenvolvimento)  
**Prefixo de API:** `/v1`  
**Swagger UI:** `GET /v1/docs` (apenas em ambiente de desenvolvimento)

---

## 1. Pré-requisitos

Antes de começar a integrar, o **administrador do Core Engine** precisa:

1. **Criar uma aplicação** via `POST /v1/applications`
2. **Guardar o `client_secret`** retornado — exibido **apenas uma vez** (RN02)
3. **Associar escopos** à aplicação via `POST /v1/applications/:id/scopes`

Se você é o integrador externo, solicite ao administrador:
- O `client_id` da sua aplicação
- O `client_secret` correspondente
- A lista de escopos disponíveis para sua integração

---

## 2. Fluxo completo de integração

```
┌──────────────────┐         ┌──────────────────────────┐
│  Sistema Externo │         │   Core Engine & Auth      │
└────────┬─────────┘         └───────────────┬──────────┘
         │                                    │
         │  POST /v1/oauth/token              │
         │  { grant_type, client_id,          │
         │    client_secret, scope }          │
         │ ─────────────────────────────────► │
         │                                    │  Valida credenciais
         │                                    │  Verifica escopos cadastrados
         │                                    │  Emite JWT M2M
         │  { access_token, token_type,       │
         │    expires_in, scope }             │
         │ ◄───────────────────────────────── │
         │                                    │
         │  GET /v1/recurso-protegido         │
         │  Authorization: Bearer <token>     │
         │ ─────────────────────────────────► │
         │                                    │  JwtAuthGuard valida assinatura
         │                                    │  ScopesGuard verifica escopos
         │  { success: true, data: {...} }    │
         │ ◄───────────────────────────────── │
```

---

## 3. Endpoints de token

### 3.1. OAuth 2.0 Token Endpoint (padrão RFC 6749)

```
POST /v1/oauth/token
```

Este é o **endpoint canônico** OAuth 2.0. Aceita tanto `application/json` quanto `application/x-www-form-urlencoded`.

### 3.2. Alias simplificado (legado)

```
POST /v1/integration/token
```

Atalho para o grant `client_credentials`. Mantido por compatibilidade. Prefira `/v1/oauth/token` para novas integrações.

---

## 4. Grant type: `client_credentials`

O grant type recomendado para integrações M2M. Não requer usuário humano.

### Requisição (JSON)

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

### Requisição (form-urlencoded — RFC 6749 padrão)

```bash
curl -X POST http://localhost:3000/v1/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=meu_client_id&client_secret=meu_client_secret&scope=orders:read%20orders:write"
```

### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `grant_type` | `string` | ✅ | Deve ser `"client_credentials"` |
| `client_id` | `string` | ✅ | Identificador público da aplicação |
| `client_secret` | `string` | ✅ | Segredo da aplicação (obtenha com o admin) |
| `scope` | `string` | ❌ | Escopos desejados separados por espaço. Se omitido, retorna todos os escopos cadastrados para a aplicação |

### Resposta de sucesso (200)

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 900,
    "scope": "orders:read orders:write"
  },
  "timestamp": "2026-04-24T02:30:00.000Z",
  "path": "/v1/oauth/token"
}
```

| Campo | Descrição |
|---|---|
| `data.access_token` | JWT de integração — use no header `Authorization: Bearer <token>` |
| `data.token_type` | Sempre `"Bearer"` |
| `data.expires_in` | TTL em segundos (padrão: 900 = 15 minutos, configurável via `JWT_EXPIRES_IN`) |
| `data.scope` | Escopos efetivamente concedidos (pode ser subconjunto do solicitado) |

---

## 5. Grant type: `refresh_token`

Renova um access token usando um refresh token emitido previamente. Aplica rotação obrigatória (RN03): o refresh antigo é invalidado após o uso.

> **Atenção:** tokens M2M (`client_credentials`) normalmente **não emitem** refresh tokens. Este grant é mais comum no fluxo de usuário humano. Consulte o administrador sobre a política vigente.

### Requisição

```bash
curl -X POST http://localhost:3000/v1/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "refresh_token",
    "refresh_token": "seu_refresh_token_aqui"
  }'
```

### Resposta de sucesso (200)

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 900,
    "refresh_token": "novo_refresh_token"
  },
  "timestamp": "2026-04-24T02:30:00.000Z",
  "path": "/v1/oauth/token"
}
```

---

## 6. Payload do JWT de integração

Após decodificar o `access_token`, você verá:

```json
{
  "sub": "7f3a9b2c-1234-5678-abcd-ef0123456789",
  "type": "integration_access",
  "clientId": "meu_client_id",
  "scopes": ["orders:read", "orders:write"],
  "iat": 1745454600,
  "exp": 1745455500
}
```

| Claim | Descrição |
|---|---|
| `sub` | UUID da aplicação no banco |
| `type` | Sempre `"integration_access"` para tokens M2M |
| `clientId` | Identificador público da aplicação |
| `scopes` | Escopos concedidos neste token |
| `iat` | Timestamp de emissão (Unix, segundos) |
| `exp` | Timestamp de expiração (Unix, segundos) |

> **Algoritmo:** HS256. Valide com o `JWT_SECRET` compartilhado pelo administrador.

---

## 7. Usando o token em requisições protegidas

Inclua o token no header `Authorization` de todas as requisições a rotas protegidas:

```bash
# Exemplo: acessar rota que exige escopo "orders:read"
curl -X GET http://localhost:3000/v1/orders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 8. Escopos

### 8.1. O que são escopos

Escopos definem **o que sua aplicação pode fazer** via M2M. São strings semânticas no formato `recurso:acao`:

```
<recurso>:<acao>
```

Exemplos:

| Escopo | Significado |
|---|---|
| `orders:read` | Leitura de pedidos |
| `orders:write` | Criação/atualização de pedidos |
| `reports:read` | Leitura de relatórios |
| `users:read` | Leitura de usuários (restrito ao admin) |

### 8.2. Como solicitar escopos específicos

No campo `scope` da requisição, liste os escopos desejados separados por **espaço**:

```json
{
  "grant_type": "client_credentials",
  "client_id": "meu_client_id",
  "client_secret": "meu_client_secret",
  "scope": "orders:read reports:read"
}
```

**Regras (RF22):**
- Os escopos solicitados devem ser **subconjunto** dos escopos cadastrados para a aplicação
- Se solicitar um escopo que não foi associado à sua aplicação, a requisição falha com `AUTH_INVALID_SCOPE`
- Se omitir `scope`, todos os escopos cadastrados para a aplicação são concedidos
- A resposta sempre retorna os escopos **efetivamente concedidos** no campo `scope`

### 8.3. Como adicionar escopos à sua aplicação

> *Requer permissão administrativa.*

1. Liste os escopos globais disponíveis:
   ```bash
   GET /v1/scopes
   Authorization: Bearer <admin_token>
   ```

2. Associe escopos à sua aplicação:
   ```bash
   curl -X POST http://localhost:3000/v1/applications/{id}/scopes \
     -H "Authorization: Bearer <admin_token>" \
     -H "Content-Type: application/json" \
     -d '{ "scopeCodes": ["orders:read", "orders:write"] }'
   ```

---

## 9. Tratamento de erros

Todos os erros seguem o envelope padrão do Core Engine:

```json
{
  "success": false,
  "error": {
    "code": "CÓDIGO_DO_ERRO",
    "message": "Descrição legível do erro"
  },
  "timestamp": "2026-04-24T02:30:00.000Z",
  "path": "/v1/oauth/token"
}
```

### Catálogo de erros OAuth relevantes

| HTTP | `error.code` | Causa | Como resolver |
|---|---|---|---|
| `400` | `VALIDATION_ERROR` | Parâmetro ausente ou inválido (ex.: `grant_type` faltando) | Revise o payload da requisição |
| `401` | `AUTH_INVALID_CLIENT` | `client_id` ou `client_secret` incorretos, ou aplicação inativa | Confirme as credenciais com o administrador |
| `401` | `AUTH_INVALID_SCOPE` | Escopo solicitado não foi associado à aplicação | Solicite ao admin associar o escopo, ou remova-o da requisição |
| `401` | `AUTH_UNSUPPORTED_GRANT_TYPE` | `grant_type` não reconhecido | Use `client_credentials` ou `refresh_token` |
| `401` | `AUTH_REFRESH_INVALID` | Refresh token inválido, expirado ou usuário inativo | Obtenha um novo token via `client_credentials` |
| `401` | `AUTH_REFRESH_REUSED` | Refresh token já foi utilizado (rotação) | Sempre use o refresh mais recente; descarte os anteriores |
| `403` | `AUTHZ_FORBIDDEN` | Token válido, mas sem o escopo exigido pela rota | Solicite token com os escopos corretos |
| `500` | `INTERNAL_ERROR` | Erro interno no servidor | Tente novamente; se persistir, contate o suporte |

### Exemplos práticos

#### Credenciais inválidas (401)

```bash
curl -X POST http://localhost:3000/v1/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "meu_client_id",
    "client_secret": "senha-errada"
  }'
```

```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_CLIENT",
    "message": "Invalid client credentials or application inactive"
  },
  "timestamp": "2026-04-24T02:30:00.000Z",
  "path": "/v1/oauth/token"
}
```

#### Sem escopo suficiente ao acessar rota protegida (403)

```json
{
  "success": false,
  "error": {
    "code": "AUTHZ_FORBIDDEN",
    "message": "Insufficient scopes. Required: orders:write"
  },
  "timestamp": "2026-04-24T02:30:00.000Z",
  "path": "/v1/orders"
}
```

---

## 10. Script de integração completo (`curl`)

Exemplo reproduzível do fluxo completo: obter token → chamar rota protegida.

```bash
#!/bin/bash
# ============================================================
# Integração M2M completa — Core Engine & Auth
# Substitua CLIENT_ID e CLIENT_SECRET pelos valores reais
# ============================================================

BASE_URL="http://localhost:3000"
CLIENT_ID="meu_client_id"
CLIENT_SECRET="meu_client_secret"
SCOPE="orders:read"

echo "1. Obtendo token M2M..."
RESPONSE=$(curl -s -X POST "$BASE_URL/v1/oauth/token" \
  -H "Content-Type: application/json" \
  -d "{
    \"grant_type\": \"client_credentials\",
    \"client_id\": \"$CLIENT_ID\",
    \"client_secret\": \"$CLIENT_SECRET\",
    \"scope\": \"$SCOPE\"
  }")

echo "Resposta do token: $RESPONSE"

# Extrair token (requer jq instalado)
ACCESS_TOKEN=$(echo $RESPONSE | jq -r '.data.access_token')
EXPIRES_IN=$(echo $RESPONSE | jq -r '.data.expires_in')

echo ""
echo "Token obtido! Expira em ${EXPIRES_IN}s"
echo ""

echo "2. Chamando rota protegida com o token..."
curl -s -X GET "$BASE_URL/v1/integration/test-scope" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
```

---

## 11. Validação manual do token JWT

Para debugar ou inspecionar o payload do token, utilize [jwt.io](https://jwt.io) ou o comando:

```bash
# Decodificar payload (sem verificar assinatura — apenas para debug)
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." | \
  cut -d. -f2 | \
  base64 -d 2>/dev/null | \
  jq .
```

> **Nunca valide tokens em produção sem verificar a assinatura.** Use a biblioteca JWT da sua stack com `JWT_SECRET`.

---

## 12. Boas práticas de segurança

| Prática | Descrição |
|---|---|
| **Nunca exponha o `client_secret`** | Trate como senha; armazene em secret manager, não no código-fonte ou repositório |
| **Use HTTPS em produção** | Todas as requisições devem ser feitas sobre TLS |
| **Renove tokens antes de expirar** | O TTL padrão é 15 minutos; implemente renovação proativa |
| **Solicite o mínimo de escopos** | Princípio do menor privilégio: peça apenas os escopos necessários |
| **Trate `AUTHZ_FORBIDDEN` programaticamente** | Nunca dependa apenas da mensagem de erro; use `error.code` |
| **Revogue credenciais comprometidas** | Solicite `POST /v1/applications/:id/regenerate-secret` imediatamente |

---

## 13. Referências

| Recurso | Onde encontrar |
|---|---|
| Swagger UI interativo | `GET /v1/docs` (ambiente dev) |
| Envelope de resposta e catálogo completo de `error.code` | [`docs/INTEGRATION_API_CONTRACT.md`](INTEGRATION_API_CONTRACT.md) |
| Claims JWT e validação de tokens | [`docs/JWT_GUIDE.md`](JWT_GUIDE.md) |
| Guia de testes do ScopesGuard | [`docs/SCOPES_GUARD_TEST_GUIDE.md`](SCOPES_GUARD_TEST_GUIDE.md) |
| Requisitos funcionais (RF17, RF21–RF23) | `PRD.md` §7 |
| Regras de negócio (RN02–RN05) | `PRD.md` §9 |
| RFC 6749 — The OAuth 2.0 Authorization Framework | [tools.ietf.org/html/rfc6749](https://tools.ietf.org/html/rfc6749) |
