// import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// import { Pool } from 'pg';
// import { PrismaPg } from '@prisma/adapter-pg';

// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
//   constructor() {
//     const pool = new Pool({ connectionString: process.env.DATABASE_URL });
//     const adapter = new PrismaPg(pool);
//     super({ adapter });
//   }

//   async onModuleInit() {
//     if (!process.env.DATABASE_URL) return;
//     await this.$connect();
//   }

//   async onModuleDestroy() {
//     if (!process.env.DATABASE_URL) return;
//     await this.$disconnect();
//   }
// }

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL || '';
    let schema: string | null = null;
    try {
      const url = new URL(connectionString);
      schema = url.searchParams.get('schema');
    } catch (e) {
      // ignore invalid URL parsing
    }

    const pool = new Pool({ connectionString });
    pool.on('connect', (client) => {
      if (schema) {
        client.query(`SET search_path TO "${schema}", public`);
      }
    });

    const adapter = new PrismaPg(pool);
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

