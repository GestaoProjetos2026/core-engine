import { JwtService } from '@nestjs/jwt';
import { ApplicationsService } from '../applications/applications.service';
import { OAuthTokenRequestDto } from './dto/oauth-token-request.dto';
import { OAuthTokenResponseDto } from './dto/oauth-token-response.dto';
import { AuthService } from '../auth/auth.service';
export declare class IntegrationService {
    private readonly applicationsService;
    private readonly authService;
    private readonly jwt;
    private readonly logger;
    constructor(applicationsService: ApplicationsService, authService: AuthService, jwt: JwtService);
    issueToken(dto: OAuthTokenRequestDto): Promise<OAuthTokenResponseDto>;
    private handleClientCredentials;
    private handleRefreshToken;
}
//# sourceMappingURL=integration.service.d.ts.map