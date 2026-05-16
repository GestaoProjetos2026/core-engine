import { PrismaService } from '../../server/prisma/prisma.service';
import { HealthService } from '../../server/health/health.service';
export declare class DashboardService {
    private readonly prisma;
    private readonly health;
    constructor(prisma: PrismaService, health: HealthService);
    getStats(): Promise<{
        totalUsers: number;
        totalRoles: number;
        totalApplications: number;
        systemHealth: string;
        status: {
            database: "ok" | "degraded";
            redis: "ok" | "degraded";
            auth: string;
        };
    }>;
}
//# sourceMappingURL=dashboard.service.d.ts.map