# Core Engine & Auth — Squad 1

Módulo de autenticação, controle de acesso (RBAC) e API Gateway do ERP Modular Cloud-Native.

## Sobre

O Squad 1 é a fundação do ERP. Todo tráfego do sistema passa por este módulo antes de chegar a qualquer outro serviço — autenticação de usuários, gerenciamento de roles e permissões, e roteamento centralizado via API Gateway.

## Stack

- **Runtime:** Node.js v20 LTS + TypeScript
- **Framework:** Fastify
- **ORM:** Prisma 7
- **Banco de dados:** PostgreSQL 16
- **Cache:** Redis 7
- **Validação:** Zod
- **Testes:** Vitest

## Pré-requisitos

- Node.js v20 LTS
- Docker Desktop

## Instalação
```bash
# Clonar o repositório
git clone git@github.com:GestaoProjetos2026/Core-Engine.git
cd Core-Engine

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Subir banco de dados e Redis
docker compose up -d

# Criar as tabelas
npx prisma migrate dev

# Popular com dados iniciais
npx prisma db seed

# Iniciar em desenvolvimento
npm run dev
```

## Variáveis de Ambiente
```env
DATABASE_URL="postgresql://admin:admin123@localhost:5432/erp_core"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="sua-string-secreta-longa"
JWT_EXPIRES_IN="15m"
REFRESH_EXPIRES_IN="7d"
PORT=3000
```

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/v1/auth/register` | Criar usuário |
| POST | `/v1/auth/login` | Autenticar |
| POST | `/v1/auth/logout` | Encerrar sessão |
| POST | `/v1/auth/refresh` | Renovar token |
| GET | `/v1/auth/me` | Usuário autenticado |
| GET | `/v1/users` | Listar usuários |
| GET | `/v1/roles` | Listar roles |
| GET | `/v1/permissions` | Listar permissões |
| GET | `/v1/health` | Health check |

Documentação completa disponível em `/docs` com o servidor rodando.

## Fluxo de Trabalho
```bash
# Começar o dia
git checkout develop
git pull origin develop

# Criar branch para a tarefa
git checkout -b feature/CORE-XX-descricao-breve

# Commitar
git add .
git commit -m "feat(auth): descrição [CORE-XX]"

# Enviar
git push -u origin feature/CORE-XX-descricao-breve
```

Abrir Pull Request com `base: develop` e solicitar revisão antes do merge.

## Padrão de Commits
```
tipo(escopo): descrição curta [CORE-XX]
```

Tipos: `feat`, `fix`, `docs`, `test`, `chore`, `refactor`

## Estrutura do Projeto
```
src/
├── modules/
│   ├── auth/
│   ├── users/
│   └── rbac/
└── shared/
    ├── middleware/
    └── utils/
prisma/
├── schema.prisma
└── seed.ts
```

## Time

Squad 1 — ERP Modular Cloud-Native  
Engenharia e Gestão de Projetos — 2025
