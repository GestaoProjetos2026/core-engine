import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../server/prisma/prisma.service';
import type { AuthTokensDto, RegisteredUserDto } from './dto/auth-response.dto';
import type { LoginDto } from './dto/login.dto';
import type { RefreshDto } from './dto/refresh.dto';
import type { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly logger;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto): Promise<RegisteredUserDto>;
    login(dto: LoginDto): Promise<AuthTokensDto>;
    /**
     * RF04 / RN03 — rotate refresh: old token invalidated; reuse → AUTH_REFRESH_REUSED.
     */
    refresh(dto: RefreshDto): Promise<AuthTokensDto>;
    private throwRefreshInvalid;
    private throwRefreshReused;
    private signAccessToken;
    private buildAccessPayload;
    private createRefreshToken;
    private insertRefreshTokenRow;
    private accessExpiresSeconds;
    private bcryptRounds;
    private isUniqueViolation;
}
//# sourceMappingURL=auth.service.d.ts.map