import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { parseDurationToSeconds } from './auth-time.util';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
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
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
