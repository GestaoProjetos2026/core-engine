import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Req, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthTokensDto, RegisteredUserDto, UserProfileDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RateLimitGuard } from '../../server/common/rate-limit/rate-limit.guard';
import { LoginStatusInterceptor } from '../../server/common/rate-limit/login-status.interceptor';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a user',
    description: 'Creates an account with e-mail, name and password (RF01, RNF08).',
  })
  @ApiResponse({
    status: 201,
    description: 'User created',
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'ana@empresa.com' },
        name: { type: 'string', example: 'Ana Silva' },
        password: { type: 'string', example: 'strongPassword123!' },
      },
      required: ['email', 'name', 'password'],
    },
  })
  async register(@Body() dto: RegisterDto): Promise<RegisteredUserDto> {
    return this.auth.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RateLimitGuard)
  @UseInterceptors(LoginStatusInterceptor)
  @ApiOperation({
    summary: 'Login with e-mail and password',
    description:
      'Returns access and refresh tokens (RF02, RF03). Subject to rate limiting and lockout (RNF07).',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens issued',
  })
  @ApiResponse({
    status: 429,
    description: 'Rate limit exceeded or account locked (RNF07)',
    schema: {
      example: {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many attempts or account locked. Please try again later.',
          details: {
            retryAfter: 60,
          },
        },
        timestamp: '2026-04-08T12:00:00.000Z',
        path: '/v1/auth/login',
      },
    },
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'admin@example.com' },
        password: { type: 'string', example: 'AdminCore2026!' },
      },
      required: ['email', 'password'],
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', example: 'eyJhbGci...' },
      },
      required: ['refreshToken'],
    },
  })
  async refresh(@Body() dto: RefreshDto): Promise<AuthTokensDto> {
    return this.auth.refresh(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'RF08: Returns user profile and effective roles/perms using a Bearer token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Valid user profile',
  })


  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or non-user token',
  })
  getMe(@Req() req: any): UserProfileDto {
    const user = req.user;
    if (user?.type !== 'user_access') {
      throw new UnauthorizedException({
        message: 'Endpoint restricted to user access tokens',
        errorCode: 'AUTH_TOKEN_INVALID',
      });
    }

    return {
      userId: user.userId,
      tenantId: user.tenantId,
      email: user.email,
      roles: user.roles,
      perms: user.perms,
      type: user.type,
    };
  }
}
