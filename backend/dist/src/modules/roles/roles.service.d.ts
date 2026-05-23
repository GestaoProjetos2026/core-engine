import { PrismaService } from '../../server/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleUsersDto } from './dto/assign-role-users.dto';
import { AssignRolePermissionsDto } from './dto/assign-role-permissions.dto';
import { Prisma } from '@prisma/client';
export declare class RolesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createRoleDto: CreateRoleDto): Promise<{
        id: string;
        name: string;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        permissions: {
            permission: {
                description: string;
                id: string;
                code: string;
            };
        }[];
        _count: {
            permissions: number;
            users: number;
        };
    }[]>;
    assignUsers(roleId: string, dto: AssignRoleUsersDto): Promise<Prisma.BatchPayload>;
    assignPermissions(roleId: string, dto: AssignRolePermissionsDto): Promise<Prisma.BatchPayload>;
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