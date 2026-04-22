import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../server/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      return await this.prisma.role.create({
        data: {
          name: createRoleDto.name,
        },
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException({
          code: 'RESOURCE_CONFLICT',
          message: 'Role name already exists (RN06)',
        });
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.role.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}

