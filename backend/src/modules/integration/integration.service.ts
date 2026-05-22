import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApplicationsService } from '../applications/applications.service';
import { OAuthGrantType, OAuthTokenRequestDto } from './dto/oauth-token-request.dto';
import { OAuthTokenResponseDto } from './dto/oauth-token-response.dto';
import { parseDurationToSeconds } from '../auth/auth-time.util';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class IntegrationService {
  private readonly logger = new Logger(IntegrationService.name);

  constructor(
    @Inject(ApplicationsService) private readonly applicationsService: ApplicationsService,
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(JwtService) private readonly jwt: JwtService,
  ) {}

  async issueToken(dto: OAuthTokenRequestDto): Promise<OAuthTokenResponseDto> {
    switch (dto.grant_type) {
      case OAuthGrantType.CLIENT_CREDENTIALS:
        return this.handleClientCredentials(dto);
      case OAuthGrantType.REFRESH_TOKEN:
        return this.handleRefreshToken(dto);
      default:
        throw new UnauthorizedException({
          errorCode: 'AUTH_UNSUPPORTED_GRANT_TYPE',
          message: 'Grant type not supported',
        });
    }
  }

  private async handleClientCredentials(dto: OAuthTokenRequestDto): Promise<OAuthTokenResponseDto> {
    const { client_id, client_secret, scope } = dto;

    if (!client_id || !client_secret) {
      throw new UnauthorizedException({
        errorCode: 'AUTH_INVALID_CLIENT',
        message: 'Client credentials missing',
      });
    }

    const application = await this.applicationsService.validateCredentials(client_id, client_secret);

    if (!application) {
      throw new UnauthorizedException({
        errorCode: 'AUTH_INVALID_CLIENT',
        message: 'Invalid client credentials or application inactive',
      });
    }

    // Validate scopes if requested
    let grantedScopes: string[] = application.scopes.map(as => as.scope.code);
    if (scope) {
      const requestedScopes = scope.split(' ');
      const validScopes = requestedScopes.filter(s => grantedScopes.includes(s));
      // RFC 6749: if scope is invalid, we can either fail or return subset.
      // We'll return the intersection as per common practices, but if none match we might fail.
      if (validScopes.length === 0 && requestedScopes.length > 0) {
        throw new UnauthorizedException({
          errorCode: 'AUTH_INVALID_SCOPE',
          message: 'None of the requested scopes are allowed for this application',
        });
      }
      grantedScopes = validScopes;
    }

    const payload = {
      sub: application.id,
      type: 'integration_access',
      clientId: application.clientId,
      scopes: grantedScopes,
    };

    const accessToken = await this.jwt.signAsync(payload);
    const expiresIn = parseDurationToSeconds(process.env.JWT_EXPIRES_IN ?? '15m', 900);

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      scope: grantedScopes.join(' '),
    };
  }

  private async handleRefreshToken(dto: OAuthTokenRequestDto): Promise<OAuthTokenResponseDto> {
    if (!dto.refresh_token) {
      throw new UnauthorizedException({
        errorCode: 'AUTH_INVALID_REQUEST',
        message: 'Refresh token missing',
      });
    }

    // Use AuthService to handle the rotation logic
    const tokens = await this.authService.refresh({ refreshToken: dto.refresh_token });

    return {
      access_token: tokens.accessToken,
      token_type: 'Bearer',
      expires_in: tokens.expiresIn,
      refresh_token: tokens.refreshToken,
    };
  }
}
