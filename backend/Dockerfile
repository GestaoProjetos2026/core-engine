# # Stage 1: Build
# FROM node:22-alpine AS builder

# # Instala dependências de compilação para módulos nativos (como bcrypt se necessário)
# RUN apk add --no-cache python3 make g++

# WORKDIR /app

# # Copia arquivos de definição de dependências
# COPY package*.json ./
# COPY prisma ./prisma/

# # Instala todas as dependências (incluindo devDependencies para o build)
# RUN npm install

# # Gera o Prisma Client
# RUN npx prisma generate

# # Copia o restante do código fonte e configurações
# COPY . .

# # Executa o build do projeto (TypeScript -> JS)
# RUN npm run build

# # Remove as devDependencies para reduzir o tamanho da imagem final
# RUN npm prune --production

# # Stage 2: Production
# FROM node:22-alpine

# WORKDIR /app

# # Variáveis de ambiente padrão
# ENV NODE_ENV=production
# ENV PORT=3000

# # Copia apenas o necessário do estágio de build
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/prisma ./prisma

# # Cria um usuário sem privilégios de root para segurança
# RUN addgroup -S nodejs && adduser -S nestjs -G nodejs
# RUN chown -R nestjs:nodejs /app

# USER nestjs

# # Expõe a porta configurada
# EXPOSE 3000

# # Healthcheck seguindo a especificação do endpoint /v1/health (RNF09)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD wget --quiet --tries=1 --spider http://localhost:3000/v1/health || exit 1

# # Comando para iniciar a aplicação
# CMD ["node", "dist/src/main.js"]

# Stage 1: Build
FROM node:22-alpine AS builder

# Instala dependências de compilação para módulos nativos (como bcrypt se necessário)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copia arquivos de definição de dependências
COPY package*.json ./
COPY prisma.config.mts ./ 
COPY prisma ./prisma/

# Instala todas as dependências (incluindo devDependencies para o build)
RUN npm install

# Gera o Prisma Client
# Lucas alterou aqui
# RUN DATABASE_URL="postgresql://admin:admin123@localhost:5432/erp_core?schema=public" npx prisma generate
RUN DATABASE_URL="postgresql://user_core_engine:SenhaCore123!@postgres-svc.infra-banco.svc.cluster.local:5432/infra_banco" npx prisma generate

# Copia o restante do código fonte e configurações
COPY . .

# Executa o build do projeto (TypeScript -> JS)
RUN npm run build

# Remove as devDependencies para reduzir o tamanho da imagem final
RUN npm prune --production

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000

# Copia apenas o necessário do estágio de build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
# Lucas adicionou aqui
COPY --from=builder /app/prisma.config.mts ./prisma.config.mts

# Cria um usuário sem privilégios de root para segurança
RUN addgroup -S nodejs && adduser -S nestjs -G nodejs
RUN chown -R nestjs:nodejs /app

USER nestjs

# Expõe a porta configurada
EXPOSE 3000

# Healthcheck seguindo a especificação do endpoint /v1/health (RNF09)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/v1/health || exit 1

# Comando para iniciar a aplicação
# CMD ["node", "dist/src/main.js"]

# Lucas Alterou aqui
CMD ["sh", "-c", "set -e; echo '🔥 BACKEND DOCKERFILE ATUALIZADO - STARTUP'; echo '🚀 Running Prisma migrate...'; npx prisma migrate deploy; echo '🚀 Running Prisma seed...'; npx prisma db seed; echo '✅ Prisma seed completed'; exec node dist/src/main.js"]
# CMD ["sh", "-c", "set -e; echo '🔥 BACKEND DOCKERFILE ATUALIZADO - STARTUP'; echo '🚀 Running Prisma migrate...'; npx prisma migrate deploy || echo '⚠️ Prisma migrate failed; continuing to seed/start app'; echo '🚀 Running Prisma seed...'; npx prisma db seed; echo '✅ Prisma seed completed'; exec node dist/src/main.js"]
# CMD ["sh", "-c", "set -e; echo '🔥 BACKEND DOCKERFILE ATUALIZADO - STARTUP'; echo '🚀 Running Prisma db push...'; npx prisma db push --accept-data-loss; echo '🚀 Running Prisma seed...'; npx prisma db seed; echo '✅ Prisma seed completed'; exec node dist/src/main.js"]