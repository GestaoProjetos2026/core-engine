import { PrismaService } from '../../server/prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
export declare class PermissionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createPermissionDto: CreatePermissionDto): Promise<{
        description: string;
        id: string;
        code: string;
    }>;
    findAll(): Promise<{
        description: string;
        id: string;
        code: string;
    }[]>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=permissions.service.d.ts.map