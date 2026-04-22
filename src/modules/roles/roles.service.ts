import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../server/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignRoleUsersDto } from './dto/assign-role-users.dto';
import { AssignRolePermissionsDto } from './dto/assign-role-permissions.dto';
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
        _count: {
          select: {
            users: true,
            permissions: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async assignUsers(roleId: string, dto: AssignRoleUsersDto) {
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException({
        code: 'RESOURCE_NOT_FOUND',
        message: `Role with ID ${roleId} not found`,
      });
    }

    try {
      const data = dto.userIds.map((userId) => ({
        roleId,
        userId,
      }));

      return await this.prisma.userRole.createMany({
        data,
        skipDuplicates: true,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new NotFoundException({
          code: 'RESOURCE_NOT_FOUND',
          message: 'One or more users do not exist (RN07)',
        });
      }
      throw error;
    }
  }

  async assignPermissions(roleId: string, dto: AssignRolePermissionsDto) {
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException({
        code: 'RESOURCE_NOT_FOUND',
        message: `Role with ID ${roleId} not found`,
      });
    }

    try {
      const data = dto.permissionIds.map((permissionId) => ({
        roleId,
        permissionId,
      }));

      return await this.prisma.rolePermission.createMany({
        data,
        skipDuplicates: true,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new NotFoundException({
          code: 'RESOURCE_NOT_FOUND',
          message: 'One or more permissions do not exist (RN07)',
        });
      }
      throw error;
    }
  }
}

