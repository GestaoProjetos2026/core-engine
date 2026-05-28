/// <reference types="node" />

import { defineConfig } from "prisma/config";
import "dotenv/config";

/**
 * Fallback for `prisma generate` when DATABASE_URL is unset (Docker build, CI postinstall).
 * Runtime/migrate/seed must set DATABASE_URL in the environment.
 */
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://prisma-build:prisma-build@127.0.0.1:5432/prisma_build?schema=core_engine";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node dist/prisma/seed.js",
  },
  datasource: {
    url: databaseUrl,
  },
});
