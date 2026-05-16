import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
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
    deletePermission(id: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=permissions.controller.d.ts.map