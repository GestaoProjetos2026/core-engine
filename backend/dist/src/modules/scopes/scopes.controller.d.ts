import { ScopesService } from './scopes.service';
import { CreateScopeDto } from './dto/create-scope.dto';
export declare class ScopesController {
    private readonly scopesService;
    constructor(scopesService: ScopesService);
    create(createScopeDto: CreateScopeDto): Promise<{
        description: string;
        id: string;
        code: string;
    }>;
    findAll(): Promise<{
        description: string;
        id: string;
        code: string;
    }[]>;
}
//# sourceMappingURL=scopes.controller.d.ts.map