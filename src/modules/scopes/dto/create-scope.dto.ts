import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateScopeDto {
  @ApiProperty({
    description: 'Unique code for the scope (e.g., orders.read)',
    example: 'orders.read',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code!: string;

  @ApiProperty({
    description: 'Human-readable description of what this scope allows',
    example: 'Permite leitura de pedidos na API',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description!: string;
}
