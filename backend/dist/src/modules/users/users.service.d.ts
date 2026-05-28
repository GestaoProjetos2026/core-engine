import { PrismaService } from '../../server/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { AuditService } from '../audit/audit.service';
export declare class UsersService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    create(createUserDto: CreateUserDto, tenantId: string): Promise<{
        id: string;
        email: string;
        name: string;
        status: import(".prisma/client").$Enums.UserStatus;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(query: ListUsersQueryDto, tenantId: string): Promise<{
        items: {
            id: string;
            email: string;
            name: string;
            status: import(".prisma/client").$Enums.UserStatus;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string, tenantId: string): Promise<{
        id: string;
        email: string;
        name: string;
        status: import(".prisma/client").$Enums.UserStatus;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto, tenantId: string): Promise<{
        id: string;
        email: string;
        name: string;
        status: import(".prisma/client").$Enums.UserStatus;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changeStatus(id: string, changeStatusDto: ChangeUserStatusDto, tenantId: string): Promise<{
        id: string;
        email: string;
        name: string;
        status: import(".prisma/client").$Enums.UserStatus;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=users.service.d.ts.map