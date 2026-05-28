import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export type JwtPayload = {
  sub: string;
  email?: string;
  type: 'user_access' | 'integration_access';
  tenant_id?: string;
  roles?: string[];
  perms?: string[];
  clientId?: string;
  scopes?: string[];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-insecure-change-me',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.type) {
      throw new UnauthorizedException({
        message: 'Invalid token type',
        errorCode: 'AUTH_TOKEN_INVALID',
      });
    }

    return {
      userId: payload.sub, // user UUID for user_access; application id for M2M
      email: payload.email,
      tenantId: payload.tenant_id,
      roles: payload.roles ?? [],
      perms: payload.perms ?? [],
      type: payload.type,
      clientId: payload.clientId,
      scopes: payload.scopes ?? [],
    };
  }
}
