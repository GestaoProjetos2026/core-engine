import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../server/prisma/prisma.service';
import { CreateScopeDto } from './dto/create-scope.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ScopesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(createScopeDto: CreateScopeDto) {
    try {
      const scope = await this.prisma.scope.create({
        data: {
          code: createScopeDto.code,
          description: createScopeDto.description,
        },
      });
      return scope;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException({ code: 'RESOURCE_CONFLICT', message: 'Scope code must be unique' });
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.scope.findMany({
      orderBy: { code: 'asc' },
    });
  }
}
