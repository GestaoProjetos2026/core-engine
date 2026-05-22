import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({ description: 'Nome da aplicação', example: 'App Parceiro' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;
}
