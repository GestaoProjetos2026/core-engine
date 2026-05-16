import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class AssignRoleUsersDto {
  @ApiProperty({
    description: 'Array of User IDs to assign to the role',
    example: ['uuid-1', 'uuid-2'],
    type: [String],
  })
  @IsArray()
  @IsUUID('all', { each: true })
  userIds!: string[];
}
