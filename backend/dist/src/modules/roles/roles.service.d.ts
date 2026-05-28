import { PrismaService } from '../../server/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleUsersDto } from './dto/assign-role-users.dto';
import { AssignRolePermissionsDto } from './dto/assign-role-permissions.dto';
export declare class RolesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createRoleDto: CreateRoleDto): Promise<any>;
    findAll(): Promise<any>;
    assignUsers(roleId: string, dto: AssignRoleUsersDto): Promise<any>;
    assignPermissions(roleId: string, dto: AssignRolePermissionsDto): Promise<any>;
    removeUser(roleId: string, userId: string): Promise<{
        success: boolean;
    }>;
    removePermission(roleId: string, permissionId: string): Promise<{
        success: boolean;
    }>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=roles.service.d.ts.map