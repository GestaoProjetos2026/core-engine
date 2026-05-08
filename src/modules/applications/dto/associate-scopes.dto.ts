import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString, IsUUID } from 'class-validator';

export class AssociateScopesDto {
  @ApiProperty({
    description: 'Array of Scope UUIDs to associate with the application',
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174000'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsUUID(4, { each: true })
  scopeIds!: string[];
}
