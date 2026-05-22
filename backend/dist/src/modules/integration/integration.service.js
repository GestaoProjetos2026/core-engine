"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var IntegrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const applications_service_1 = require("../applications/applications.service");
const oauth_token_request_dto_1 = require("./dto/oauth-token-request.dto");
const auth_time_util_1 = require("../auth/auth-time.util");
const auth_service_1 = require("../auth/auth.service");
let IntegrationService = IntegrationService_1 = class IntegrationService {
    applicationsService;
    authService;
    jwt;
    logger = new common_1.Logger(IntegrationService_1.name);
    constructor(applicationsService, authService, jwt) {
        this.applicationsService = applicationsService;
        this.authService = authService;
        this.jwt = jwt;
    }
    async issueToken(dto) {
        switch (dto.grant_type) {
            case oauth_token_request_dto_1.OAuthGrantType.CLIENT_CREDENTIALS:
                return this.handleClientCredentials(dto);
            case oauth_token_request_dto_1.OAuthGrantType.REFRESH_TOKEN:
                return this.handleRefreshToken(dto);
            default:
                throw new common_1.UnauthorizedException({
                    errorCode: 'AUTH_UNSUPPORTED_GRANT_TYPE',
                    message: 'Grant type not supported',
                });
        }
    }
    async handleClientCredentials(dto) {
        const { client_id, client_secret, scope } = dto;
        if (!client_id || !client_secret) {
            throw new common_1.UnauthorizedException({
                errorCode: 'AUTH_INVALID_CLIENT',
                message: 'Client credentials missing',
            });
        }
        const application = await this.applicationsService.validateCredentials(client_id, client_secret);
        if (!application) {
            throw new common_1.UnauthorizedException({
                errorCode: 'AUTH_INVALID_CLIENT',
                message: 'Invalid client credentials or application inactive',
            });
        }
        // Validate scopes if requested
        let grantedScopes = application.scopes.map(as => as.scope.code);
        if (scope) {
            const requestedScopes = scope.split(' ');
            const validScopes = requestedScopes.filter(s => grantedScopes.includes(s));
            // RFC 6749: if scope is invalid, we can either fail or return subset.
            // We'll return the intersection as per common practices, but if none match we might fail.
            if (validScopes.length === 0 && requestedScopes.length > 0) {
                throw new common_1.UnauthorizedException({
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
        const expiresIn = (0, auth_time_util_1.parseDurationToSeconds)(process.env.JWT_EXPIRES_IN ?? '15m', 900);
        return {
            access_token: accessToken,
            token_type: 'Bearer',
            expires_in: expiresIn,
            scope: grantedScopes.join(' '),
        };
    }
    async handleRefreshToken(dto) {
        if (!dto.refresh_token) {
            throw new common_1.UnauthorizedException({
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
};
exports.IntegrationService = IntegrationService;
exports.IntegrationService = IntegrationService = IntegrationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(applications_service_1.ApplicationsService)),
    __param(1, (0, common_1.Inject)(auth_service_1.AuthService)),
    __param(2, (0, common_1.Inject)(jwt_1.JwtService)),
    __metadata("design:paramtypes", [applications_service_1.ApplicationsService,
        auth_service_1.AuthService,
        jwt_1.JwtService])
], IntegrationService);
//# sourceMappingURL=integration.service.js.map