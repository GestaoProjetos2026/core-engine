import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'users:read',
    description: 'Unique semantic code for the permission. (RF11, RN06)',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  code: string;

  @ApiProperty({
    example: 'Allows reading user list and details',
    description: 'Description of what this permission allows.',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string;
}
