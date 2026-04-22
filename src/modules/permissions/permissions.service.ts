import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../server/prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PermissionsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    try {
      return await this.prisma.permission.create({
        data: {
          code: createPermissionDto.code,
          description: createPermissionDto.description,
        },
        select: {
          id: true,
          code: true,
          description: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException({
          code: 'RESOURCE_CONFLICT',
          message: 'Permission code already exists (RN06)',
        });
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.permission.findMany({
      select: {
        id: true,
        code: true,
        description: true,
      },
      orderBy: { code: 'asc' },
    });
  }
}

