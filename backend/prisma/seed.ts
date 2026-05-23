import { PrismaClient, type Role, type Scope } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import {
  adminUserDefs,
  e2eM2mAppDef,
  m2mAppDefs,
  viewerUserDef,
  type AdminUserDef,
  type M2mAppDef,
} from './seed-data';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const isProduction = process.env.NODE_ENV === 'production';
const updatePasswords =
  process.env.SEED_UPDATE_PASSWORDS === 'true' ||
  (!isProduction && process.env.SEED_UPDATE_PASSWORDS !== 'false');

const permissionDefs: { code: string; description: string }[] = [
  { code: 'users:read', description: 'Visualizar lista e detalhes de usuários' },
  { code: 'users:write', description: 'Criar, atualizar e excluir usuários' },
  { code: 'roles:read', description: 'Visualizar papéis de acesso' },
  { code: 'roles:write', description: 'Criar e atualizar papéis' },
  { code: 'roles:manage', description: 'Vincular usuários e permissões a papéis' },
  { code: 'permissions:read', description: 'Visualizar catálogo de permissões' },
  { code: 'permissions:write', description: 'Gerenciar permissões do sistema' },
  { code: 'applications:read', description: 'Visualizar aplicações integradas' },
  { code: 'applications:write', description: 'Gerenciar aplicações e segredos' },
  { code: 'scopes:read', description: 'Visualizar catálogo de escopos' },
  { code: 'scopes:write', description: 'Gerenciar escopos e vínculos' },
  { code: 'audit:read', description: 'Visualizar logs de auditoria e eventos críticos' },
  { code: 'health:read', description: 'Visualizar status de saúde do sistema' },
  { code: 'dashboard:read', description: 'Visualizar resumo e métricas do dashboard' },
  { code: 'orders:read', description: 'Visualizar pedidos (Módulo Vendas)' },
  { code: 'orders:write', description: 'Gerenciar pedidos (Módulo Vendas)' },
  { code: 'customers:read', description: 'Visualizar clientes (Módulo CRM)' },
  { code: 'customers:write', description: 'Gerenciar clientes (Módulo CRM)' },
  { code: 'products:read', description: 'Visualizar catálogo de produtos' },
  { code: 'products:write', description: 'Gerenciar catálogo de produtos' },
  { code: 'inventory:read', description: 'Visualizar estoque' },
  { code: 'inventory:write', description: 'Movimentar estoque' },
];

const scopeDefs: { code: string; description: string }[] = [
  { code: 'read:all', description: 'Leitura total (M2M)' },
  { code: 'write:all', description: 'Escrita total (M2M)' },
  { code: 'orders:read', description: 'Leitura de pedidos' },
  { code: 'orders:write', description: 'Criação/alteração de pedidos' },
  { code: 'customers:read', description: 'Leitura de clientes' },
  { code: 'customers:write', description: 'Escrita de clientes' },
  { code: 'products:read', description: 'Leitura de produtos' },
  { code: 'products:write', description: 'Escrita de produtos' },
  { code: 'inventory:read', description: 'Leitura de estoque' },
  { code: 'inventory:write', description: 'Escrita de estoque' },
];

function resolveSecret(envKey: string, fallback: string): string {
  const fromEnv = process.env[envKey]?.trim();
  if (fromEnv) {
    return fromEnv;
  }
  if (isProduction) {
    throw new Error(
      `Missing required env ${envKey} for production seed (set via cluster secrets)`,
    );
  }
  return fallback;
}

async function seedAdminUsers(adminRole: Role, defs: AdminUserDef[]): Promise<void> {
  for (const def of defs) {
    const plainPassword = resolveSecret(def.passwordEnvKey, def.defaultPassword);
    const passwordHash = await bcrypt.hash(plainPassword, 12);

    const user = await prisma.user.upsert({
      where: { email: def.email },
      update: updatePasswords ? { passwordHash, name: def.name, status: 'ACTIVE' } : { name: def.name, status: 'ACTIVE' },
      create: {
        email: def.email,
        name: def.name,
        passwordHash,
        status: 'ACTIVE',
      },
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: adminRole.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: adminRole.id,
      },
    });

    console.log(`   - admin user: ${def.email} (role: admin)`);
  }
}

async function seedViewerUser(viewerRole: Role): Promise<void> {
  const def = viewerUserDef;
  const plainPassword = resolveSecret(def.passwordEnvKey, def.defaultPassword);
  const passwordHash = await bcrypt.hash(plainPassword, 12);

  const user = await prisma.user.upsert({
    where: { email: def.email },
    update: updatePasswords ? { passwordHash, name: def.name, status: 'ACTIVE' } : { name: def.name, status: 'ACTIVE' },
    create: {
      email: def.email,
      name: def.name,
      passwordHash,
      status: 'ACTIVE',
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: viewerRole.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: viewerRole.id,
    },
  });

  console.log(`   - viewer user: ${def.email} (role: viewer)`);
}

async function linkAllScopesToApp(applicationId: string, scopes: Scope[]): Promise<void> {
  for (const scope of scopes) {
    await prisma.applicationScope.upsert({
      where: {
        applicationId_scopeId: {
          applicationId,
          scopeId: scope.id,
        },
      },
      update: {},
      create: {
        applicationId,
        scopeId: scope.id,
      },
    });
  }
}

async function seedM2mApplication(def: M2mAppDef, scopes: Scope[]): Promise<void> {
  const clientSecret =
    def.clientId === 'test-client-id'
      ? def.defaultSecret
      : resolveSecret(def.secretEnvKey, def.defaultSecret);
  const clientSecretHash = await bcrypt.hash(clientSecret, 12);

  const app = await prisma.application.upsert({
    where: { clientId: def.clientId },
    update: updatePasswords
      ? { clientSecretHash, name: def.name, status: 'ACTIVE' }
      : { name: def.name, status: 'ACTIVE' },
    create: {
      name: def.name,
      clientId: def.clientId,
      clientSecretHash,
      status: 'ACTIVE',
    },
  });

  await linkAllScopesToApp(app.id, scopes);
  console.log(`   - m2m app: ${def.clientId} (all scopes linked)`);
}

async function main() {
  console.log(`Seed mode: NODE_ENV=${process.env.NODE_ENV ?? 'undefined'}, updatePasswords=${updatePasswords}`);

  const permissions = await Promise.all(
    permissionDefs.map((p) =>
      prisma.permission.upsert({
        where: { code: p.code },
        update: { description: p.description },
        create: { code: p.code, description: p.description },
      }),
    ),
  );

  console.log(`✅ ${permissions.length} permissions upserted`);

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  const viewerRole = await prisma.role.upsert({
    where: { name: 'viewer' },
    update: {},
    create: { name: 'viewer' },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'manager' },
    update: {},
    create: { name: 'manager' },
  });

  console.log('✅ Roles (admin, viewer, manager) upserted');

  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }
  console.log('✅ Admin linked to all permissions');

  const viewerPerms = permissions.filter((p) => p.code.endsWith(':read'));
  for (const permission of viewerPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: viewerRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: viewerRole.id,
        permissionId: permission.id,
      },
    });
  }
  console.log(`✅ Viewer linked to ${viewerPerms.length} read permissions`);

  const managerPerms = permissions.filter(
    (p) =>
      p.code.endsWith(':read') ||
      p.code.startsWith('orders:') ||
      p.code.startsWith('customers:') ||
      p.code.startsWith('products:') ||
      p.code.startsWith('inventory:'),
  );
  for (const permission of managerPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: managerRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: managerRole.id,
        permissionId: permission.id,
      },
    });
  }
  console.log(`✅ Manager linked to ${managerPerms.length} permissions`);

  console.log('✅ Seeding admin users:');
  await seedAdminUsers(adminRole, adminUserDefs);
  await seedViewerUser(viewerRole);

  const scopes = await Promise.all(
    scopeDefs.map((s) =>
      prisma.scope.upsert({
        where: { code: s.code },
        update: { description: s.description },
        create: { code: s.code, description: s.description },
      }),
    ),
  );

  console.log(`✅ ${scopes.length} scopes upserted`);

  console.log('✅ Seeding M2M applications:');
  for (const def of m2mAppDefs) {
    await seedM2mApplication(def, scopes);
  }
  await seedM2mApplication(e2eM2mAppDef, scopes);

  if (!isProduction) {
    console.log('\n📋 Local dev credentials (passwords from env or defaults in seed-data.ts):');
    for (const def of adminUserDefs) {
      console.log(`   - ${def.email} → env ${def.passwordEnvKey} or ${def.defaultPassword}`);
    }
    console.log(`   - ${viewerUserDef.email} → env ${viewerUserDef.passwordEnvKey} or ${viewerUserDef.defaultPassword}`);
    for (const def of [...m2mAppDefs, e2eM2mAppDef]) {
      console.log(`   - ${def.clientId} → env ${def.secretEnvKey} or ${def.defaultSecret}`);
    }
  } else {
    console.log('\n📋 Production seed complete (credentials not logged; use cluster secrets).');
    console.log('   Admin emails:', adminUserDefs.map((d) => d.email).join(', '));
    console.log('   M2M client_ids:', [...m2mAppDefs, e2eM2mAppDef].map((d) => d.clientId).join(', '));
  }

  console.log('\n🎉 Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
