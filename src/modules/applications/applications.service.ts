import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../server/prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ChangeApplicationStatusDto } from './dto/change-application-status.dto';
import { ListApplicationsQueryDto } from './dto/list-applications-query.dto';
import { AssociateScopesDto } from './dto/associate-scopes.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AuditService) private readonly audit: AuditService,
  ) {}

  private generateClientCredentials() {
    const clientId = crypto.randomUUID().replace(/-/g, '');
    const clientSecret = crypto.randomBytes(32).toString('hex');
    return { clientId, clientSecret };
  }

  async create(createApplicationDto: CreateApplicationDto) {
    const { clientId, clientSecret } = this.generateClientCredentials();
    const clientSecretHash = await bcrypt.hash(clientSecret, 12);

    try {
      const application = await this.prisma.application.create({
        data: {
          name: createApplicationDto.name,
          clientId,
          clientSecretHash,
          status: 'ACTIVE',
        },
        select: {
          id: true,
          clientId: true,
          name: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return { ...application, clientSecret };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException({ code: 'RESOURCE_CONFLICT', message: 'Client ID duplicado' });
      }
      throw error;
    }
  }

  async findAll(query: ListApplicationsQueryDto) {
    const { page = 1, limit = 10, name, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ApplicationWhereInput = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          clientId: true,
          name: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.application.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      select: {
        id: true,
        clientId: true,
        name: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!application) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Aplicação não encontrada' });
    }

    return application;
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto) {
    try {
      const application = await this.prisma.application.update({
        where: { id },
        data: updateApplicationDto,
        select: {
          id: true,
          clientId: true,
          name: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return application;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Aplicação não encontrada' });
      }
      throw error;
    }
  }

  async changeStatus(id: string, changeStatusDto: ChangeApplicationStatusDto) {
    try {
      const application = await this.prisma.application.update({
        where: { id },
        data: { status: changeStatusDto.status },
        select: {
          id: true,
          clientId: true,
          name: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      this.audit.logStatusChange('APPLICATION', id, changeStatusDto.status);
      return application;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Aplicação não encontrada' });
      }
      throw error;
    }
  }

  async regenerateSecret(id: string) {
    const clientSecret = crypto.randomBytes(32).toString('hex');
    const clientSecretHash = await bcrypt.hash(clientSecret, 12);
    
    try {
      const application = await this.prisma.application.update({
        where: { id },
        data: { clientSecretHash },
        select: {
          id: true,
          clientId: true,
          name: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      this.audit.logSecretRegenerated(id);
      return { ...application, clientSecret };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Aplicação não encontrada' });
      }
      throw error;
    }
  }

  async getScopes(applicationId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        scopes: {
          include: {
            scope: true,
          },
          orderBy: { scope: { code: 'asc' } }
        },
      },
    });

    if (!application) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Aplicação não encontrada' });
    }

    return application.scopes.map(as => as.scope);
  }

  async associateScopes(applicationId: string, associateScopesDto: AssociateScopesDto) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Aplicação não encontrada' });
    }

    const scopes = await this.prisma.scope.findMany({
      where: { id: { in: associateScopesDto.scopeIds } },
    });

    if (scopes.length !== associateScopesDto.scopeIds.length) {
      throw new NotFoundException({ code: 'RESOURCE_NOT_FOUND', message: 'Um ou mais escopos fornecidos não existem' });
    }

    await this.prisma.$transaction([
      this.prisma.applicationScope.deleteMany({
        where: { applicationId },
      }),
      this.prisma.applicationScope.createMany({
        data: associateScopesDto.scopeIds.map(scopeId => ({
          applicationId,
          scopeId,
        })),
        skipDuplicates: true,
      }),
    ]);

    return this.getScopes(applicationId);
  }

  async validateCredentials(clientId: string, clientSecret: string) {
    const application = await this.prisma.application.findUnique({
      where: { clientId },
      include: {
        scopes: {
          include: {
            scope: true,
          }
        }
      }
    });

    if (!application || application.status !== 'ACTIVE') {
      return null;
    }

    const isValid = await bcrypt.compare(clientSecret, application.clientSecretHash);
    if (!isValid) {
      return null;
    }

    return application;
  }
}
