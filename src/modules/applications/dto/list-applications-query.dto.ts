import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class ListApplicationsQueryDto {
  @ApiProperty({ required: false, description: 'Página atual', default: 1 })
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, description: 'Itens por página', default: 10 })
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @ApiProperty({ required: false, description: 'Filtrar por nome' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ enum: AppStatus, required: false, description: 'Filtrar por status' })
  @IsEnum(AppStatus)
  @IsOptional()
  status?: AppStatus;
}
