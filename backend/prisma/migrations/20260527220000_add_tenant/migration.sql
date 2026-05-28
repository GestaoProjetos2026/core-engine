-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tenants_name_key" ON "tenants"("name");
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

INSERT INTO "tenants" ("id", "name", "slug", "created_at", "updated_at")
VALUES (
    '00000000-0000-4000-8000-000000000001',
    'Default Organization',
    'default',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

ALTER TABLE "users" ADD COLUMN "tenant_id" TEXT;

UPDATE "users" SET "tenant_id" = '00000000-0000-4000-8000-000000000001' WHERE "tenant_id" IS NULL;

ALTER TABLE "users" ALTER COLUMN "tenant_id" SET NOT NULL;

DROP INDEX IF EXISTS "users_email_key";

CREATE UNIQUE INDEX "users_tenant_id_email_key" ON "users"("tenant_id", "email");

ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
