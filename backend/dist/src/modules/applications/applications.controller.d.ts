import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ChangeApplicationStatusDto } from './dto/change-application-status.dto';
import { ListApplicationsQueryDto } from './dto/list-applications-query.dto';
import { AssociateScopesDto } from './dto/associate-scopes.dto';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
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
    getScopes(id: string): Promise<any>;
    associateScopes(id: string, associateScopesDto: AssociateScopesDto): Promise<any>;
}
//# sourceMappingURL=applications.controller.d.ts.map