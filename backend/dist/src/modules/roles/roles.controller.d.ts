import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleUsersDto } from './dto/assign-role-users.dto';
import { AssignRolePermissionsDto } from './dto/assign-role-permissions.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createRoleDto: CreateRoleDto): Promise<any>;
    findAll(): Promise<any>;
    assignUsers(id: string, dto: AssignRoleUsersDto): Promise<any>;
    assignPermissions(id: string, dto: AssignRolePermissionsDto): Promise<any>;
    removeUser(id: string, userId: string): Promise<{
        success: boolean;
    }>;
    removePermission(id: string, permissionId: string): Promise<{
        success: boolean;
    }>;
    deleteRole(id: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=roles.controller.d.ts.map