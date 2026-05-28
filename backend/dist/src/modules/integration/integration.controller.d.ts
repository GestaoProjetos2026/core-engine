import { IntegrationService } from './integration.service';
import { OAuthTokenRequestDto } from './dto/oauth-token-request.dto';
import { OAuthTokenResponseDto } from './dto/oauth-token-response.dto';
export declare class IntegrationController {
    private readonly integrationService;
    constructor(integrationService: IntegrationService);
    oauthToken(dto: OAuthTokenRequestDto): Promise<OAuthTokenResponseDto>;
    integrationToken(dto: OAuthTokenRequestDto): Promise<OAuthTokenResponseDto>;
    testScope(): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserIdentity(id: string, tenantId: string): Promise<{
        id: string;
        email: string;
        name: string;
        status: import(".prisma/client").$Enums.UserStatus;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=integration.controller.d.ts.map