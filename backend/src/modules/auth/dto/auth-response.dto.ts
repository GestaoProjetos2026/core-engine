import { ApiProperty } from '@nestjs/swagger';

export class RegisteredUserDto {
  @ApiProperty({ type: 'string' })
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: ['ACTIVE', 'INACTIVE'] })
  status!: string;
}

export class AuthTokensDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: string;

  @ApiProperty({
    description: 'Access token lifetime in seconds',
    example: 900,
  })
  expiresIn!: number;
}

export class UserProfileDto {
  @ApiProperty({ description: 'User UUID (same as JWT claim `sub` / checklist `user_id`)' })
  userId!: string;

  @ApiProperty({ description: 'Tenant UUID (same as JWT claim `tenant_id`)' })
  tenantId!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ type: [String] })
  roles!: string[];

  @ApiProperty({ type: [String] })
  perms!: string[];

  @ApiProperty({ example: 'user_access' })
  type!: string;
}
