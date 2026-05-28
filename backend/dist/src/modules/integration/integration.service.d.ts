import { JwtService } from '@nestjs/jwt';
import { ApplicationsService } from '../applications/applications.service';
import { OAuthTokenRequestDto } from './dto/oauth-token-request.dto';
import { OAuthTokenResponseDto } from './dto/oauth-token-response.dto';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
export declare class IntegrationService {
    private readonly applicationsService;
    private readonly authService;
    private readonly jwt;
    private readonly usersService;
    private readonly logger;
    constructor(applicationsService: ApplicationsService, authService: AuthService, jwt: JwtService, usersService: UsersService);
    /** RF29 — public identity fields for M2M consumers (Squad 2 emitente, Squad 3 display name). */
    findUserIdentityById(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    issueToken(dto: OAuthTokenRequestDto): Promise<OAuthTokenResponseDto>;
    private handleClientCredentials;
    private handleRefreshToken;
}
//# sourceMappingURL=integration.service.d.ts.map