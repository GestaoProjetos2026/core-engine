import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    // where: { email: 'admin@example.com' },
    where: { email: 'admin@hotmail.com' },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: { include: { permission: true } },
            },
          },
        },
      },
    },
  });
  console.log(JSON.stringify(user, null, 2));
  await prisma.$disconnect();
}

main();
