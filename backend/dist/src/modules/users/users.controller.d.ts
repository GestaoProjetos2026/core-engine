import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
//# sourceMappingURL=users.controller.d.ts.map