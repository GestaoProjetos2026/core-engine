import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
//# sourceMappingURL=dashboard.controller.d.ts.map