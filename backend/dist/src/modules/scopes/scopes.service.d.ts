import { PrismaService } from '../../server/prisma/prisma.service';
import { CreateScopeDto } from './dto/create-scope.dto';
export declare class ScopesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createScopeDto: CreateScopeDto): Promise<any>;
    findAll(): Promise<any>;
}
//# sourceMappingURL=scopes.service.d.ts.map