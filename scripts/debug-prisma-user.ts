import 'dotenv/config';
import { hash } from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL missing');
  const pool = new Pool({ connectionString: url });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  const h = await hash('ValidPass1!x', 12);
  const u = await prisma.user.create({
    data: {
      email: `debug-${Date.now()}@test.x`,
      name: 'D',
      passwordHash: h,
      status: 'ACTIVE',
    },
  });
  console.log('ok', u.id);
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
