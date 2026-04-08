import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserStatus, type Prisma } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../server/prisma/prisma.service';
import { parseDurationToDate, parseDurationToSeconds } from './auth-time.util';
import type { AuthTokensDto, RegisteredUserDto } from './dto/auth-response.dto';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import { assertStrongPassword } from './password-policy';

const userAuthInclude = {
  roles: {
    include: {
      role: {
        include: {
          permissions: { include: { permission: true } },
        },
      },
    },
  },
} satisfies Prisma.UserInclude;

type UserWithRoles = Prisma.UserGetPayload<{ include: typeof userAuthInclude }>;

type UserAccessJwtPayload = {
  sub: string;
  email: string;
  type: 'user_access';
  roles: string[];
  perms: string[];
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<RegisteredUserDto> {
    try {
      assertStrongPassword(dto.password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid password';
      throw new BadRequestException({ message: msg });
    }
    const rounds = this.bcryptRounds();
    const passwordHash = await hash(dto.password, rounds);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          passwordHash,
          status: UserStatus.ACTIVE,
        },
      });
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
      };
    } catch (e: unknown) {
      if (this.isUniqueViolation(e)) {
        throw new ConflictException({
          message: 'Email already registered',
        });
      }
      throw e;
    }
  }

  async login(dto: LoginDto): Promise<AuthTokensDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: userAuthInclude,
    });

    const valid =
      user &&
      user.status === UserStatus.ACTIVE &&
      (await compare(dto.password, user.passwordHash));

    if (!valid) {
      throw new UnauthorizedException({
        message: 'Invalid email or password',
        errorCode: 'AUTH_INVALID_CREDENTIALS',
      });
    }

    const accessToken = await this.signAccessToken(user);
    const refreshToken = await this.createRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.accessExpiresSeconds(),
    };
  }

  private async signAccessToken(user: UserWithRoles): Promise<string> {
    const payload = this.buildAccessPayload(user);
    return this.jwt.signAsync(payload);
  }

  private buildAccessPayload(user: UserWithRoles): UserAccessJwtPayload {
    const roles = user.roles.map((ur) => ur.role.name);
    const perms = new Set<string>();
    for (const ur of user.roles) {
      for (const rp of ur.role.permissions) {
        perms.add(rp.permission.code);
      }
    }
    return {
      sub: user.id,
      email: user.email,
      type: 'user_access',
      roles,
      perms: [...perms],
    };
  }

  private async createRefreshToken(userId: string): Promise<string> {
    const raw = randomBytes(48).toString('base64url');
    const tokenHash = createHash('sha256').update(raw).digest('hex');
    const expiresAt = parseDurationToDate(
      process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d',
    );
    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
      },
    });
    return raw;
  }

  private accessExpiresSeconds(): number {
    return parseDurationToSeconds(process.env.JWT_EXPIRES_IN ?? '15m', 900);
  }

  private bcryptRounds(): number {
    const n = Number(process.env.BCRYPT_ROUNDS);
    return Number.isFinite(n) && n >= 12 ? n : 12;
  }

  private isUniqueViolation(e: unknown): boolean {
    return (
      typeof e === 'object' &&
      e !== null &&
      'code' in e &&
      (e as { code: string }).code === 'P2002'
    );
  }
}
