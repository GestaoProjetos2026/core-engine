import { Module } from '@nestjs/common';
import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from '../modules/users/users.module';
import { RolesModule } from '../modules/roles/roles.module';
import { PermissionsModule } from '../modules/permissions/permissions.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';

import { ApplicationsModule } from '../modules/applications/applications.module';
import { ScopesModule } from '../modules/scopes/scopes.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    ApplicationsModule,
    ScopesModule,
  ],
})
export class AppModule {}








