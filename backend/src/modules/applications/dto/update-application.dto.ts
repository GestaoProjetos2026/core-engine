import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateApplicationDto {
  @ApiProperty({ description: 'Nome da aplicação', example: 'App Parceiro v2', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;
}
