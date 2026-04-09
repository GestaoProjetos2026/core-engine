import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { parseDurationToSeconds } from './auth-time.util';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [
    PassportModule,
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
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PermissionsGuard],
  exports: [AuthService, JwtStrategy, PermissionsGuard],
})
export class AuthModule {}
