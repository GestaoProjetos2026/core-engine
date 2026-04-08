import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthTokensDto, RegisteredUserDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a user',
    description: 'Creates an account with e-mail, name and password (RF01, RNF08).',
  })
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: RegisteredUserDto,
  })
  @ApiBadRequestResponse({
    description: 'Password policy or validation failed (RNF08)',
  })
  @ApiConflictResponse({
    description: 'Duplicate e-mail (RN06)',
    schema: {
      example: {
        success: false,
        error: {
          code: 'RESOURCE_CONFLICT',
          message: 'Email already registered',
        },
        timestamp: '2026-04-08T12:00:00.000Z',
        path: '/v1/auth/register',
      },
    },
  })
  async register(@Body() dto: RegisterDto): Promise<RegisteredUserDto> {
    return this.auth.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with e-mail and password',
    description:
      'Returns access and refresh tokens (RF02, RF03). Failed login does not reveal whether the e-mail exists.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens issued',
    type: AuthTokensDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials or inactive user (RN01)',
    schema: {
      example: {
        success: false,
        error: {
          code: 'AUTH_INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
        timestamp: '2026-04-08T12:00:00.000Z',
        path: '/v1/auth/login',
      },
    },
  })
  async login(@Body() dto: LoginDto): Promise<AuthTokensDto> {
    return this.auth.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'RF04 / RN03: issues a new access + refresh pair and invalidates the submitted refresh token. Reuse of an old refresh returns 401 AUTH_REFRESH_REUSED.',
  })
  @ApiResponse({
    status: 200,
    description: 'New tokens issued',
    type: AuthTokensDto,
  })
  @ApiUnauthorizedResponse({
    description:
      'Invalid or expired refresh (AUTH_REFRESH_INVALID), or reuse/revoked/concurrent race (AUTH_REFRESH_REUSED)',
    schema: {
      examples: {
        invalid: {
          value: {
            success: false,
            error: {
              code: 'AUTH_REFRESH_INVALID',
              message: 'Invalid or expired refresh token',
            },
            timestamp: '2026-04-08T12:00:00.000Z',
            path: '/v1/auth/refresh',
          },
        },
        reused: {
          value: {
            success: false,
            error: {
              code: 'AUTH_REFRESH_REUSED',
              message: 'Refresh token was already used or revoked',
            },
            timestamp: '2026-04-08T12:00:00.000Z',
            path: '/v1/auth/refresh',
          },
        },
      },
    },
  })
  async refresh(@Body() dto: RefreshDto): Promise<AuthTokensDto> {
    return this.auth.refresh(dto);
  }
}
