import { PrismaService } from '../../server/prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ChangeApplicationStatusDto } from './dto/change-application-status.dto';
import { ListApplicationsQueryDto } from './dto/list-applications-query.dto';
import { AssociateScopesDto } from './dto/associate-scopes.dto';
import { AuditService } from '../audit/audit.service';
export declare class ApplicationsService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    private generateClientCredentials;
    create(createApplicationDto: CreateApplicationDto): Promise<{
        clientSecret: string;
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.AppStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
    }>;
    findAll(query: ListApplicationsQueryDto): Promise<{
        items: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.AppStatus;
            createdAt: Date;
            updatedAt: Date;
            clientId: string;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.AppStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
    }>;
    update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<{
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.AppStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
    }>;
    changeStatus(id: string, changeStatusDto: ChangeApplicationStatusDto): Promise<{
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.AppStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
    }>;
    regenerateSecret(id: string): Promise<{
        clientSecret: string;
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.AppStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
    }>;
    getScopes(applicationId: string): Promise<{
        description: string;
        id: string;
        code: string;
    }[]>;
    associateScopes(applicationId: string, associateScopesDto: AssociateScopesDto): Promise<{
        description: string;
        id: string;
        code: string;
    }[]>;
    validateCredentials(clientId: string, clientSecret: string): Promise<({
        scopes: ({
            scope: {
                description: string;
                id: string;
                code: string;
            };
        } & {
            applicationId: string;
            scopeId: string;
        })[];
    } & {
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.AppStatus;
        createdAt: Date;
        updatedAt: Date;
        clientId: string;
        clientSecretHash: string;
    }) | null>;
}
//# sourceMappingURL=applications.service.d.ts.map