import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'users:read' })
  code!: string;

  @ApiProperty({ example: 'Allows reading user list' })
  description!: string;
}
