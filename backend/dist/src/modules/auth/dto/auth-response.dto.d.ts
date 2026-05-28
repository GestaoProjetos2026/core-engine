export declare class RegisteredUserDto {
    id: string;
    email: string;
    name: string;
    status: string;
}
export declare class AuthTokensDto {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}
export declare class UserProfileDto {
    userId: string;
    tenantId: string;
    email: string;
    roles: string[];
    perms: string[];
    type: string;
}
//# sourceMappingURL=auth-response.dto.d.ts.map