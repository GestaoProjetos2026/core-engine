import 'dotenv/config';
import { hash } from 'bcrypt';
import { PrismaClient, UserStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL missing');
  const pool = new Pool({ connectionString: url });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  const email = `check-${Date.now()}@test.local`;
  const h = await hash('ValidPass1!x', 12);
  const u = await prisma.user.create({
    data: {
      email,
      name: 'Check',
      passwordHash: h,
      status: UserStatus.ACTIVE,
    },
  });
  console.log('create ok', u.id, u.email);
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error('create failed', e);
  process.exit(1);
});
