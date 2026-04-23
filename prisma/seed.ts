import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const permissionDefs: { code: string; description: string }[] = [
  { code: 'users:list', description: 'List users' },
  { code: 'users:read', description: 'Read users' },
  { code: 'users:write', description: 'Create and update users' },
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
  { code: 'roles:read', description: 'Read roles' },
  { code: 'roles:write', description: 'Create/Update roles' },
  { code: 'permissions:read', description: 'Read permissions' },
  { code: 'permissions:write', description: 'Create/Update permissions' },
];

const rolePermissionMatrix: Record<string, string[]> = {
  admin: permissionDefs.map((permission) => permission.code),
  manager: [
    'users:list',
    'users:read',
    'users:write',
    'roles:read',
    'permissions:read',
    'invoice:read',
    'invoice:create',
    'crm:read',
    'crm:create',
    'tickets:read',
    'tickets:create',
  ],
  operator: [
    'users:read',
    'invoice:read',
    'crm:read',
    'tickets:read',
    'tickets:create',
  ],
  viewer: [
    'users:list',
    'users:read',
    'roles:read',
    'permissions:read',
    'invoice:read',
    'crm:read',
    'tickets:read',
  ],
};

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

  const roleNames = Object.keys(rolePermissionMatrix);
  const roles = await Promise.all(
    roleNames.map((roleName) =>
      prisma.role.upsert({
        where: { name: roleName },
        update: {},
        create: { name: roleName },
      }),
    ),
  );
  const roleByName = new Map(roles.map((role) => [role.name, role]));
  const permissionByCode = new Map(permissions.map((permission) => [permission.code, permission]));

  console.log(`✅ ${roles.length} roles upserted`);

  for (const [roleName, permissionCodes] of Object.entries(rolePermissionMatrix)) {
    const role = roleByName.get(roleName);
    if (!role) {
      throw new Error(`Missing role during seed: ${roleName}`);
    }

    for (const permissionCode of permissionCodes) {
      const permission = permissionByCode.get(permissionCode);
      if (!permission) {
        throw new Error(`Missing permission during seed: ${permissionCode}`);
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }

    console.log(`✅ Role "${roleName}" linked to ${permissionCodes.length} permissions`);
  }

  // Criar usuários semente
  const defaultPassword = 'Password123!';
  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  const defaultUsers: Array<{ email: string; name: string; roleName: string }> = [
    { email: 'admin@example.com', name: 'Admin User', roleName: 'admin' },
    { email: 'manager@example.com', name: 'Manager User', roleName: 'manager' },
    { email: 'operator@example.com', name: 'Operator User', roleName: 'operator' },
    { email: 'viewer@example.com', name: 'Viewer User', roleName: 'viewer' },
  ];

  for (const userSeed of defaultUsers) {
    const role = roleByName.get(userSeed.roleName);
    if (!role) {
      throw new Error(`Missing role for seeded user: ${userSeed.roleName}`);
    }

    const user = await prisma.user.upsert({
      where: { email: userSeed.email },
      update: { passwordHash, name: userSeed.name, status: 'ACTIVE' },
      create: {
        email: userSeed.email,
        name: userSeed.name,
        passwordHash,
        status: 'ACTIVE',
      },
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: role.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: role.id,
      },
    });
  }

  console.log('✅ Default users created and linked to initial roles');
  console.log('   - admin@example.com / Password123!');
  console.log('   - manager@example.com / Password123!');
  console.log('   - operator@example.com / Password123!');
  console.log('   - viewer@example.com / Password123!');
  
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
