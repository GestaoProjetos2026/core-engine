import { Module } from '@nestjs/common';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';
import { ApplicationsModule } from '../applications/applications.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { parseDurationToSeconds } from '../auth/auth-time.util';

@Module({
  imports: [
    ApplicationsModule,
    AuthModule,
    JwtModule.register({
      global: false,
      secret: process.env.JWT_SECRET ?? 'dev-insecure-change-me',
      signOptions: {
        expiresIn: parseDurationToSeconds(
          process.env.JWT_EXPIRES_IN ?? '15m',
          900,
        ),
        algorithm: 'HS256',
      },
    }),
  ],
  controllers: [IntegrationController],
  providers: [IntegrationService],
  exports: [IntegrationService],
})
export class IntegrationModule {}
