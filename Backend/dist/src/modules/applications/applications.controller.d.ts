import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ChangeApplicationStatusDto } from './dto/change-application-status.dto';
import { ListApplicationsQueryDto } from './dto/list-applications-query.dto';
import { AssociateScopesDto } from './dto/associate-scopes.dto';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
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
    getScopes(id: string): Promise<{
        description: string;
        id: string;
        code: string;
    }[]>;
    associateScopes(id: string, associateScopesDto: AssociateScopesDto): Promise<{
        description: string;
        id: string;
        code: string;
    }[]>;
}
//# sourceMappingURL=applications.controller.d.ts.map