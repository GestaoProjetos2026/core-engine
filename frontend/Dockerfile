# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Empty = same-origin requests via gateway (/v1 on port 80)
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Gateway (nginx) + SPA
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf.template /etc/nginx/templates/default.conf.template

ENV CORE_SVC_HOST=backend:3000
ENV FISCAL_SVC_HOST=module-stubs:8080
ENV CRM_SVC_HOST=module-stubs:8080
ENV SERVICE_DESK_SVC_HOST=module-stubs:8080

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
