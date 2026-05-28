import { PrismaService } from '../../server/prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
export declare class PermissionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createPermissionDto: CreatePermissionDto): Promise<any>;
    findAll(): Promise<any>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=permissions.service.d.ts.map