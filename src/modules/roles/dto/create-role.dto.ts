import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'admin',
    description: 'Unique name for the role. (RN06)',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;
}
