FROM node:22-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
COPY prisma.config.mts ./ 
COPY prisma ./prisma/

RUN npm install

RUN DATABASE_URL="postgresql://user_core_engine:SenhaCore123!@postgres-svc.infra-banco.svc.cluster.local:5432/infra_banco" npx prisma generate

COPY . .

RUN npm run build

RUN npm prune --production

FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.mts ./prisma.config.mts

RUN addgroup -S nodejs && adduser -S nestjs -G nodejs
RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/v1/health || exit 1

CMD ["sh", "-c", "set -e; echo '🚀 Running Prisma migrate...'; npx prisma migrate deploy; if [ \"${SEED_ON_STARTUP:-true}\" != \"false\" ]; then echo '🚀 Running Prisma seed (compiled)...'; node dist/prisma/seed.js; fi; echo '✅ Startup steps completed'; exec node dist/src/main.js"]