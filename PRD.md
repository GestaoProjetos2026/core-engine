# 🔐 PRD: Core Engine & Auth (CORE-001) - Versão 2.0

---

## 📌 1. Visão Geral & Contexto

O **Core Engine & Auth** é o provedor de identidade (IdP) e o barramento de permissões central. Ele não apenas autentica, mas gerencia o ciclo de vida completo da identidade dentro do ecossistema.

- **Status:** Em Definição  
- **Stakeholders:** Equipe de Engenharia, Segurança da Informação, Gestores de Produto  

---

## 🚨 2. Análise de Segurança e Continuidade Operacional

Para garantir que o Core Engine & Auth seja resiliente e atenda aos padrões modernos de mercado, esta análise foca em pilares de segurança e experiência do usuário:

- **Autonomia no Acesso:**  
  Implementação de fluxos de autoatendimento para recuperação de credenciais, reduzindo a carga operacional de suporte técnico.

- **Segurança Adaptativa:**  
  Incorporação de Multi-Fator de Autenticação (MFA) como camada essencial para proteção de dados sensíveis em ambientes ERP.

- **Gestão de Ciclo de Vida da Sessão:**  
  Controle granular sobre a expiração e revogação de tokens, garantindo o encerramento imediato de acessos em caso de desligamento ou comprometimento de conta.

- **Rastreabilidade e Auditoria:**  
  Estrutura de logs detalhada para conformidade com normas de proteção de dados (LGPD) e auditorias de segurança cibernética.

---

## 👥 3. Personas (Refinadas)

| Persona                 | Necessidade Principal |
|------------------------|----------------------|
| Desenvolvedor Externo  | Consumir a API para validar permissões sem gerenciar banco de usuários |
| Auditor de Segurança   | Rastrear alterações de permissões e histórico |
| Usuário Final          | Recuperar acesso e usar SSO entre módulos |

---

## ⚙️ 4. Requisitos Funcionais (Expandidos)

| ID   | Requisito                 | Descrição                                                                 | Prioridade |
|------|--------------------------|---------------------------------------------------------------------------|------------|
| RF01 | Cadastro de Usuários     | Registro com e-mail único e senha segura                                 | Alta       |
| RF02 | Autenticação Segura      | Login com proteção contra força bruta (bloqueio após 5 tentativas)       | Alta       |
| RF03 | Emissão de Tokens        | Access Token + Refresh Token                                             | Alta       |
| RF04 | Validação de Acesso      | Verificação automática de token                                          | Alta       |
| RF05 | Controle por Cargos      | Agrupamento de usuários por funções                                      | Alta       |
| RF06 | Permissões Granulares    | Definição de ações específicas                                           | Alta       |
| RF07 | Consulta de Perfil       | Endpoint `/me`                                                           | Média      |
| RF08 | Gestão de Usuários       | Painel administrativo                                                    | Alta       |
| RF09 | Gestão de Matriz         | Configuração dinâmica de cargos                                          | Alta       |
| RF10 | Sincronização Modular    | Webhooks para eventos                                                    | Média      |
| RF11 | Recuperação de Senha     | Fluxo de reset via e-mail                                                | Alta       |
| RF12 | Multi-Fator (MFA)        | Suporte a TOTP ou e-mail                                                 | Alta       |
| RF13 | Revogação de Sessão      | Logout com invalidação de token                                          | Alta       |
| RF14 | Audit Log Profundo       | Registro detalhado de alterações                                         | Alta       |
| RF15 | Auto-registro (Opcional) | Permitir cadastro público                                                | Baixa      |

---

## 🧱 5. Requisitos Não Funcionais (Técnicos)

### 🔐 Segurança & Criptografia

- **Hashing:**  
  Utilizar Argon2id ou Bcrypt (custo mínimo 12).  
  ❌ Nunca usar MD5 ou SHA1.

- **Padrão de Token:**  
  - JWT para Access Tokens  
  - Opaque Tokens para Refresh Tokens (armazenados em banco)

- **Protocolo:**  
  OAuth2 + OpenID Connect (OIDC)

---

### 📜 Conformidade (LGPD)

- **Anonimização:**  
  Capacidade de desativar usuários removendo dados sensíveis, mantendo histórico com ID anônimo.

---

## 🔌 6. Definição da API (Arquitetura RESTful)

### 🔑 Auth & Session

- `POST /v1/auth/login`  
  Retorna `accessToken`, `refreshToken`, `expiresIn`

- `POST /v1/auth/forgot-password`  
  Dispara e-mail de recuperação

- `POST /v1/auth/reset-password`  
  Redefine senha via token

- `POST /v1/auth/logout`  
  Invalida o token atual

---

### 🛡️ Gestão de Acessos (RBAC)

**Estrutura:** Usuário → Roles → Permissões

- `GET /v1/roles/:id/permissions`  
  Lista permissões do cargo

- `POST /v1/users/:id/roles`  
  Atribui cargo ao usuário

---

## 📡 7. Webhooks & Integridade (Event-Driven)

### ⚠️ security.login_failed

Disparado após 3 tentativas de login falhas.

```json
{
  "event": "security.login_failed",
  "data": {
    "email": "user@target.com",
    "ip": "192.168.1.1",
    "attempts": 3
  }
}
