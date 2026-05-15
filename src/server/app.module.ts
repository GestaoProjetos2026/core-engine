import { Module } from '@nestjs/common';
import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from '../modules/users/users.module';
import { RolesModule } from '../modules/roles/roles.module';
import { PermissionsModule } from '../modules/permissions/permissions.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';

import { ApplicationsModule } from '../modules/applications/applications.module';
import { ScopesModule } from '../modules/scopes/scopes.module';
import { IntegrationModule } from '../modules/integration/integration.module';
import { RateLimitModule } from './common/rate-limit/rate-limit.module';
import { LoggerModule } from 'nestjs-pino';
import { AuditModule } from '../modules/audit/audit.module';
import { DashboardModule } from '../modules/dashboard/dashboard.module';
import { RootController } from './root.controller';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        ...(process.env.NODE_ENV !== 'production' && {
          transport: { target: 'pino-pretty', options: { colorize: true, singleLine: true } },
          level: 'debug',
        }),
      } as any,
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    ApplicationsModule,
    ScopesModule,
    IntegrationModule,
    RateLimitModule,
    AuditModule,
    DashboardModule,
  ],
  controllers: [RootController],
})


export class AppModule { }








