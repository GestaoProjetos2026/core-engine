"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TENANT_ID = exports.DEFAULT_TENANT_SLUG = void 0;
/**
 * Tenant defaults for seed and migrations (RF25).
 * Used by `prisma/seed.ts` in production (`node dist/prisma/seed.js`).
 * App code re-exports via `src/shared/constants/tenant.ts`.
 */
exports.DEFAULT_TENANT_SLUG = 'default';
exports.DEFAULT_TENANT_ID = '00000000-0000-4000-8000-000000000001';
