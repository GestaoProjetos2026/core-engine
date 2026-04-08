import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const permissionDefs: { code: string; description: string }[] = [
  { code: 'users:list', description: 'List users' },
  { code: 'users:read', description: 'Read users' },
  { code: 'users:create', description: 'Create users' },
  { code: 'users:update', description: 'Update users' },
  { code: 'users:delete', description: 'Delete users' },
  { code: 'invoice:create', description: 'Create invoices' },
  { code: 'invoice:read', description: 'Read invoices' },
  { code: 'crm:read', description: 'Read CRM' },
  { code: 'crm:create', description: 'Create CRM records' },
  { code: 'tickets:read', description: 'Read tickets' },
  { code: 'tickets:create', description: 'Create tickets' },
  { code: 'tickets:delete', description: 'Delete tickets' },
  { code: 'roles:manage', description: 'Manage roles' },
];

async function main() {
  const permissions = await Promise.all(
    permissionDefs.map((p) =>
      prisma.permission.upsert({
        where: { code: p.code },
        update: {},
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

  const accountantRole = await prisma.role.upsert({
    where: { name: 'accountant' },
    update: {},
    create: { name: 'accountant' },
  });

  const salesRole = await prisma.role.upsert({
    where: { name: 'sales_rep' },
    update: {},
    create: { name: 'sales_rep' },
  });

  console.log('✅ 4 roles upserted');

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

  const viewerPerms = permissions.filter(
    (p) => p.code.endsWith(':read') || p.code.endsWith(':list'),
  );
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

  console.log('✅ Viewer linked to read/list permissions');

  const accountantPerms = permissions.filter((p) => p.code.startsWith('invoice:'));
  for (const permission of accountantPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: accountantRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: accountantRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('✅ Accountant linked to invoice permissions');

  const salesPerms = permissions.filter((p) => p.code.startsWith('crm:'));
  for (const permission of salesPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: salesRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: salesRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('✅ Sales rep linked to CRM permissions');
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
