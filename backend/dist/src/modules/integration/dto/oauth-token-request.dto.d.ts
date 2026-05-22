export declare enum OAuthGrantType {
    CLIENT_CREDENTIALS = "client_credentials",
    REFRESH_TOKEN = "refresh_token"
}
export declare class OAuthTokenRequestDto {
    grant_type: OAuthGrantType;
    client_id?: string;
    client_secret?: string;
    scope?: string;
    refresh_token?: string;
}
//# sourceMappingURL=oauth-token-request.dto.d.ts.map