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
    create(createApplicationDto: CreateApplicationDto): Promise<any>;
    findAll(query: ListApplicationsQueryDto): Promise<{
        items: any;
        total: any;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<any>;
    changeStatus(id: string, changeStatusDto: ChangeApplicationStatusDto): Promise<any>;
    regenerateSecret(id: string): Promise<any>;
    getScopes(applicationId: string): Promise<any>;
    associateScopes(applicationId: string, associateScopesDto: AssociateScopesDto): Promise<any>;
    validateCredentials(clientId: string, clientSecret: string): Promise<any>;
}
//# sourceMappingURL=applications.service.d.ts.map