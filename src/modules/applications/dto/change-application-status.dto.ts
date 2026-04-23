import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppStatus } from '@prisma/client';

export class ChangeApplicationStatusDto {
  @ApiProperty({ enum: AppStatus, example: AppStatus.ACTIVE })
  @IsEnum(AppStatus)
  @IsNotEmpty()
  status!: AppStatus;
}
