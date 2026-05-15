import { OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class HealthService implements OnModuleDestroy {
    private readonly prisma;
    private readonly logger;
    private redisClient;
    constructor(prisma: PrismaService);
    checkDatabase(): Promise<'ok' | 'degraded'>;
    checkRedis(): Promise<'ok' | 'degraded'>;
    onModuleDestroy(): void;
}
//# sourceMappingURL=health.service.d.ts.map