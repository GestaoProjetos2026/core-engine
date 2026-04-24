import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum OAuthGrantType {
  CLIENT_CREDENTIALS = 'client_credentials',
  REFRESH_TOKEN = 'refresh_token',
}

export class OAuthTokenRequestDto {
  @IsEnum(OAuthGrantType)
  @IsNotEmpty()
  grant_type: OAuthGrantType;

  @IsString()
  @IsOptional()
  client_id?: string;

  @IsString()
  @IsOptional()
  client_secret?: string;

  @IsString()
  @IsOptional()
  scope?: string;

  @IsString()
  @IsOptional()
  refresh_token?: string;
}
