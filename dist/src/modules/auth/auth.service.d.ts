import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../server/prisma/prisma.service';
import type { AuthTokensDto, RegisteredUserDto } from './dto/auth-response.dto';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto): Promise<RegisteredUserDto>;
    login(dto: LoginDto): Promise<AuthTokensDto>;
    private signAccessToken;
    private buildAccessPayload;
    private createRefreshToken;
    private accessExpiresSeconds;
    private bcryptRounds;
    private isUniqueViolation;
}
//# sourceMappingURL=auth.service.d.ts.map