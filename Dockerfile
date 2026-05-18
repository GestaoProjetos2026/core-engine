# Stage 1: Build Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/Frontend
COPY Frontend/package*.json ./
RUN npm install
COPY Frontend/ ./
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Build Backend
FROM node:22-alpine AS backend-builder
RUN apk add --no-cache python3 make g++
WORKDIR /app/Backend
COPY Backend/package*.json ./
COPY Backend/prisma ./prisma/
RUN npm install
RUN npx prisma generate
COPY Backend/ ./
RUN npm run build
RUN npm prune --production

# Stage 3: Production Image
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copia os arquivos compilados do backend
COPY --from=backend-builder /app/Backend/package*.json ./
COPY --from=backend-builder /app/Backend/node_modules ./node_modules
COPY --from=backend-builder /app/Backend/dist ./dist
COPY --from=backend-builder /app/Backend/prisma ./prisma

# Copia os arquivos compilados do frontend para a pasta 'public'
COPY --from=frontend-builder /app/Frontend/dist ./public

# Cria um usuário sem privilégios de root para segurança
RUN addgroup -S nodejs && adduser -S nestjs -G nodejs
RUN chown -R nestjs:nodejs /app
USER nestjs

EXPOSE 3000

# Healthcheck apontando para a rota da API
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/v1/health || exit 1

# Comando para iniciar a aplicação
CMD ["node", "dist/src/main.js"]
