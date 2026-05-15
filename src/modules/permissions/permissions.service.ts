import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  async delete(id: string) {
    try {
      await this.prisma.permission.delete({ where: { id } });
      return { success: true };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Permission not found' });
      }
      throw error;
    }
  }
}
