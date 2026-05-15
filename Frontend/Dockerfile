# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copia arquivos de definição de dependências
COPY package*.json ./

# Instala todas as dependências
RUN npm install

# Copia o restante do código fonte
COPY . .

# Variável de ambiente para o build (pode ser sobrescrita pelo GitHub Actions)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Executa o build do projeto
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copia o build do estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia a configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
