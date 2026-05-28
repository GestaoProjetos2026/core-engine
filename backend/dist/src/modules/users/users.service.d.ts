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
    create(createUserDto: CreateUserDto): Promise<any>;
    findAll(query: ListUsersQueryDto): Promise<{
        items: any;
        total: any;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    changeStatus(id: string, changeStatusDto: ChangeUserStatusDto): Promise<any>;
}
//# sourceMappingURL=users.service.d.ts.map