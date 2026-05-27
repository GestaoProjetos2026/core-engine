import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

const pool = new Pool(process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : undefined);
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const permissionDefs: { code: string; description: string }[] = [
  // Identity & Access Management (IAM)
  { code: 'users:read', description: 'Visualizar lista e detalhes de usuários' },
  { code: 'users:write', description: 'Criar, atualizar e excluir usuários' },
  { code: 'roles:read', description: 'Visualizar papéis de acesso' },
  { code: 'roles:write', description: 'Criar e atualizar papéis' },
  { code: 'roles:manage', description: 'Vincular usuários e permissões a papéis' },
  { code: 'permissions:read', description: 'Visualizar catálogo de permissões' },
  { code: 'permissions:write', description: 'Gerenciar permissões do sistema' },

  // Integration & M2M
  { code: 'applications:read', description: 'Visualizar aplicações integradas' },
  { code: 'applications:write', description: 'Gerenciar aplicações e segredos' },
  { code: 'scopes:read', description: 'Visualizar catálogo de escopos' },
  { code: 'scopes:write', description: 'Gerenciar escopos e vínculos' },

  // Observability & System
  { code: 'audit:read', description: 'Visualizar logs de auditoria e eventos críticos' },
  { code: 'health:read', description: 'Visualizar status de saúde do sistema' },
  { code: 'dashboard:read', description: 'Visualizar resumo e métricas do dashboard' },

  // Domain Placeholders (Consumer Squads / ERP Modules)
  { code: 'orders:read', description: 'Visualizar pedidos (Módulo Vendas)' },
  { code: 'orders:write', description: 'Gerenciar pedidos (Módulo Vendas)' },
  { code: 'customers:read', description: 'Visualizar clientes (Módulo CRM)' },
  { code: 'customers:write', description: 'Gerenciar clientes (Módulo CRM)' },
  { code: 'products:read', description: 'Visualizar catálogo de produtos' },
  { code: 'products:write', description: 'Gerenciar catálogo de produtos' },
  { code: 'inventory:read', description: 'Visualizar estoque' },
  { code: 'inventory:write', description: 'Movimentar estoque' },
];

async function main() {
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

  // Admin: Tudo
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

  // Viewer: Tudo que termina em :read
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

  // Manager: IAM Read + Domain Read/Write (sem permissão de gerenciar IAM)
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

  // Criar usuários semente
  // const defaultPassword = 'Password123!';
  // const passwordHash = await bcrypt.hash(defaultPassword, 12);

  // const adminUser = await prisma.user.upsert({
  //   // where: { email: 'admin@example.com' },
  //   where: { email: 'admin@hotmail.com' },
  //   update: { passwordHash },
  //   create: {
  //     // email: 'admin@example.com',
  //     email: 'admin@hotmail.com',
  //     name: 'Admin User',
  //     passwordHash,
  //     status: 'ACTIVE',
  //   },
  // });

  // await prisma.userRole.upsert({
  //   where: {
  //     userId_roleId: {
  //       userId: adminUser.id,
  //       roleId: adminRole.id,
  //     },
  //   },
  //   update: {},
  //   create: {
  //     userId: adminUser.id,
  //     roleId: adminRole.id,
  //   },
  // });
  //TUDO ISSO PODE SER ALTERADO DEPOIS

  const defaultAdmins = [
  {
    email: 'admin@hotmail.com',
    name: 'Administrador Principal',
    password: 'Admin12345!',
  },
  {
    email: 'crm@example.com',
    name: 'CRM',
    password: 'CRM123456!',
  },
  {
    email: 'service-desk@example.com',
    name: 'Service Desk',
    password: 'ServiceDesk123!',
  },
  {
    email: 'fiscal@example.com',
    name: 'Fiscal',
    password: 'Fiscal123!',
  },
  {
    email: 'devOps@example.com',
    name: 'DevOps',
    password: 'DevOps123!',
  },
];

  for (const admin of defaultAdmins) {
    const passwordHash = await bcrypt.hash(admin.password, 12);
    const adminUser = await prisma.user.upsert({
      where: { email: admin.email },
      update: {
        passwordHash,
        status: 'ACTIVE',
      },
      create: {
        email: admin.email,
        name: admin.name,
        passwordHash,
        status: 'ACTIVE',
      },
    });

    await prisma.userRole.upsert({
        where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: adminRole.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    });

    console.log(`✅ Admin user ensured: ${admin.email}`);
  }

  // const viewerUser = await prisma.user.upsert({
  //   where: { email: 'viewer@example.com' },
  //   update: { passwordHash },
  //   create: {
  //     email: 'viewer@example.com',
  //     name: 'Viewer User',
  //     passwordHash,
  //     status: 'ACTIVE',
  //   },
  // });

  // await prisma.userRole.upsert({
  //   where: {
  //     userId_roleId: {
  //       userId: viewerUser.id,
  //       roleId: viewerRole.id,
  //     },
  //   },
  //   update: {},
  //   create: {
  //     userId: viewerUser.id,
  //     roleId: viewerRole.id,
  //   },
  // });
  //TUDO ISSO PODE SER ALTERADO DEPOIS

  console.log('✅ Default users created and linked to roles');
  console.log('   - admin@example.com / Password123!');
  console.log('   - viewer@example.com / Password123!');
  
  // Criar Aplicação Semente para Testes Manuais e E2E M2M
  const testAppSecret = 'test-client-secret';
  const testAppSecretHash = await bcrypt.hash(testAppSecret, 12);

  const testApp = await prisma.application.upsert({
    where: { clientId: 'test-client-id' },
    update: { clientSecretHash: testAppSecretHash, status: 'ACTIVE' },
    create: {
      name: 'Test Application',
      clientId: 'test-client-id',
      clientSecretHash: testAppSecretHash,
      status: 'ACTIVE',
    },
  });

  // Criar Escopos Semente (M2M)
  const scopeDefs: { code: string; description: string }[] = [
    { code: 'read:all', description: 'Leitura total (M2M)' },
    { code: 'write:all', description: 'Escrita total (M2M)' },
    { code: 'orders:read', description: 'Leitura de pedidos' },
    { code: 'orders:write', description: 'Criação/alteração de pedidos' },
    { code: 'customers:read', description: 'Leitura de clientes' },
    { code: 'customers:write', description: 'Escrita de clientes' },
    { code: 'products:read', description: 'Leitura de produtos' },
    { code: 'products:write', description: 'Escrita de produtos' },
  ];

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

  // Vincular escopos à aplicação de teste
  for (const scope of scopes) {
    await prisma.applicationScope.upsert({
      where: {
        applicationId_scopeId: {
          applicationId: testApp.id,
          scopeId: scope.id,
        },
      },
      update: {},
      create: {
        applicationId: testApp.id,
        scopeId: scope.id,
      },
    });
  }

  console.log('✅ Test Application linked to all scopes');
  console.log('   - clientId: test-client-id / clientSecret: test-client-secret');

  console.log('\n🎉 Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
