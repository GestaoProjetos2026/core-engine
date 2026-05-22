import { PrismaService } from '../../server/prisma/prisma.service';
import { CreateScopeDto } from './dto/create-scope.dto';
export declare class ScopesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
//# sourceMappingURL=scopes.service.d.ts.map