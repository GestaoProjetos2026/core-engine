import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../server/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AuditService) private readonly audit: AuditService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(createUserDto.password, 12);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
          passwordHash,
          status: 'ACTIVE',
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: _, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException({ code: 'RESOURCE_CONFLICT', message: 'E-mail duplicado' });
      }
      throw error;
    }
  }

  async findAll(query: ListUsersQueryDto) {
    try {
      const page = Math.max(1, Number(query.page || 1));
      const limit = Math.max(1, Math.min(100, Number(query.limit || 10)));
      const skip = (page - 1) * limit;

      const { email, status } = query;
      const where: Prisma.UserWhereInput = {};
      
      if (email && email.trim()) {
        where.email = { contains: email.trim(), mode: 'insensitive' };
      }
      
      if (status) {
        // Basic validation for status if it's passed but might not be in enum
        const validStatuses = ['ACTIVE', 'INACTIVE'];
        if (validStatuses.includes(status)) {
          where.status = status;
        }
      }

      const [items, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            email: true,
            name: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.user.count({ where }),
      ]);

      return {
        items,
        total,
        page,
        limit,
      };
    } catch (error) {
      console.error('[UsersService.findAll] Database error:', {
        message: error instanceof Error ? error.message : error,
        query,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Return a more specific error if Prisma fails due to invalid query
        throw new ConflictException({ 
          code: 'DATABASE_ERROR', 
          message: 'Error fetching users from database. Please check your filters.' 
        });
      }
      
      throw error;
    }
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Usuário não encontrado' });
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Usuário não encontrado' });
        }
        if (error.code === 'P2002') {
          throw new ConflictException({ code: 'RESOURCE_CONFLICT', message: 'E-mail duplicado' });
        }
      }
      throw error;
    }
  }

  async changeStatus(id: string, changeStatusDto: ChangeUserStatusDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { status: changeStatusDto.status },
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      this.audit.logStatusChange('USER', id, changeStatusDto.status);
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Usuário não encontrado' });
      }
      throw error;
    }
  }
}
