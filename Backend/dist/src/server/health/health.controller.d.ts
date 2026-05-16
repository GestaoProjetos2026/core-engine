import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    getHealth(): Promise<{
        status: string;
        services: {
            database: "ok" | "degraded";
            redis: "ok" | "degraded";
        };
    }>;
}
//# sourceMappingURL=health.controller.d.ts.map