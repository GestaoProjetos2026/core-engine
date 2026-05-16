import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../server/prisma/prisma.service';
import { HealthService } from '../../server/health/health.service';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(HealthService) private readonly health: HealthService,
  ) {}

  async getStats() {
    try {
      // Individual fetches to isolate potential errors
      const totalUsers = await this.prisma.user.count().catch(() => 0);
      const totalRoles = await this.prisma.role.count().catch(() => 0);
      const totalApplications = await this.prisma.application.count().catch(() => 0);
      
      const dbHealth = await this.health.checkDatabase().catch(() => 'degraded' as const);
      const redisHealth = await this.health.checkRedis().catch(() => 'degraded' as const);

      return {
        totalUsers: Number(totalUsers),
        totalRoles: Number(totalRoles),
        totalApplications: Number(totalApplications),
        systemHealth: dbHealth === 'ok' && redisHealth === 'ok' ? 'Optimal' : 'Degraded',
        status: {
          database: dbHealth,
          redis: redisHealth,
          auth: 'ok',
        }
      };
    } catch (error) {
      console.error('[DashboardService] FATAL ERROR:', error);
      throw error;
    }
  }
}
