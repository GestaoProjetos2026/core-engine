# Stage 1: Build Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Build Backend
FROM node:22-alpine AS backend-builder
RUN apk add --no-cache python3 make g++
WORKDIR /app/backend
COPY backend/package*.json ./
COPY backend/prisma ./prisma/
RUN npm install
RUN npx prisma generate
COPY backend/ ./
RUN npm run build
RUN npm prune --production

# Stage 3: Production Image (Nginx + Node)
FROM node:22-alpine
WORKDIR /app

# Instala o Nginx para servir o Frontend
RUN apk add --no-cache nginx

ENV NODE_ENV=production
# ENV PORT=3001
ENV PORT=3000

# Copia os arquivos compilados do backend
COPY --from=backend-builder /app/backend/package*.json ./
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/prisma ./prisma
# Lucas adicionou aqui
COPY --from=backend-builder /app/backend/prisma.config.mts ./prisma.config.mts

# O Frontend/nginx.conf aponta para /usr/share/nginx/html e escuta na porta 3000
RUN mkdir -p /usr/share/nginx/html /run/nginx
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copia a configuração do Nginx do frontend para o local correto do Alpine
COPY frontend/nginx.conf /etc/nginx/http.d/default.conf

# Expor as portas: 3000 (Frontend/Nginx exposto para a internet) e 3001 (Backend/Node interno)
# EXPOSE 3000 3001
EXPOSE 80 3000

# Comando para iniciar ambos os serviços
# Substitui dinamicamente a porta do Nginx, inicia o Nginx e aguarda o banco de dados ficar pronto para rodar as migrations e o seed antes de ligar a API
# CMD ["sh", "-c", "sed -i \"s/listen 3000;/listen ${PORT:-3000};/g\" /etc/nginx/http.d/default.conf && nginx || true; dokku=0; until npx prisma migrate deploy || [ $dokku -eq 10 ]; do dokku=$((dokku+1)); echo 'Waiting for DB...'; sleep 3; done; node dist/prisma/seed.js || true; node dist/src/main.js"]
CMD ["sh", "-c", "sed -i \"s/listen 3000;/listen ${PORT:-3000};/g\" /etc/nginx/http.d/default.conf && nginx || true; dokku=0; until npx prisma migrate deploy || [ $dokku -eq 10 ]; do dokku=$((dokku+1)); echo 'Waiting for DB...'; sleep 3; done; npx prisma db seed; node dist/src/main.js"]
