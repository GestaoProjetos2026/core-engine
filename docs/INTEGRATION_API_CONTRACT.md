# Integration API Contract (MVP)

Guia inicial para squads e modulos consumidores do Core/Auth.

Fonte normativa: `PRD.md` (secoes 18 e 19).

## 1) Envelope de sucesso

Formato base de respostas de sucesso:

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-03-26T15:03:48.186Z",
  "path": "/v1/health"
}
```

Campos:
- `success`: sempre `true` em respostas de sucesso.
- `data`: payload do endpoint.
- `timestamp`: data/hora ISO 8601 UTC.
- `path`: rota processada.

## 2) Envelope de erro

Formato base de respostas de erro:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Payload validation failed",
    "details": {}
  },
  "timestamp": "2026-03-26T15:03:56.831Z",
  "path": "/v1/auth/login"
}
```

Campos:
- `success`: sempre `false` em erro.
- `error.code`: codigo estavel para integracao (nao depender apenas da mensagem).
- `error.message`: mensagem legivel para humano.
- `error.details`: detalhes opcionais (validacao, contexto).
- `timestamp`: data/hora ISO 8601 UTC.
- `path`: rota processada.

Regra de override no backend:
- handlers/guards podem sobrescrever `error.code` informando `errorCode` (preferencial) ou `code` no payload da excecao HTTP;
- sem override, o filtro usa mapeamento por status HTTP.

## 3) Correlacao (`meta.requestId`)

Quando implementado no backend, respostas podem incluir:

```json
{
  "meta": {
    "requestId": "req_abc123"
  }
}
```

Uso recomendado:
- consumidores devem logar `requestId` para rastreio entre servicos;
- em incidentes, enviar `requestId` no chamado para acelerar diagnostico.

## 4) Catalogo inicial de `error.code` (PRD 19.1)

| HTTP | error.code | Uso |
|------|------------|-----|
| 400 | `VALIDATION_ERROR` | Payload invalido |
| 401 | `AUTH_INVALID_CREDENTIALS` | Login falho |
| 401 | `AUTH_TOKEN_EXPIRED` | Access token expirado |
| 401 | `AUTH_TOKEN_INVALID` | Token invalido/assinatura/formato |
| 403 | `AUTHZ_FORBIDDEN` | Sem permissao ou escopo |
| 404 | `RESOURCE_NOT_FOUND` | Recurso inexistente |
| 409 | `RESOURCE_CONFLICT` | Duplicidade |
| 429 | `RATE_LIMIT_EXCEEDED` | Limite de tentativas/throttling |
| 500 | `INTERNAL_ERROR` | Erro interno |

Convencao atual para 401:
- fallback generico: `AUTH_TOKEN_INVALID` (rotas protegidas por token);
- para login falho: usar override explicito `AUTH_INVALID_CREDENTIALS`;
- para token expirado: usar override explicito `AUTH_TOKEN_EXPIRED`.

## 5) Referencia cruzada com Swagger

Quando habilitado no ambiente, consultar Swagger UI em:
- `GET /v1/docs` (convencao principal)
- alternativa de framework: `/api`

Swagger deve refletir os contratos deste documento para payloads e erros.

