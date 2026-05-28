import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const pool = new Pool(process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : undefined);
    let schema = 'core_engine';
    if (process.env.DATABASE_URL) {
      try {
        const url = new URL(process.env.DATABASE_URL);
        schema = url.searchParams.get('schema') || 'core_engine';
      } catch (e) {}
    }
    const adapter = new PrismaPg(pool, { schema });
    super({ adapter });
  }

  async onModuleInit() {
    if (!process.env.DATABASE_URL) return;
    await this.$connect();
  }

  async onModuleDestroy() {
    if (!process.env.DATABASE_URL) return;
    await this.$disconnect();
  }
}