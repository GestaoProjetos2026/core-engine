import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      let errorCode = 'AUTH_TOKEN_INVALID';
      let message = 'Invalid or missing access token';
      
      if (info && info.name === 'TokenExpiredError') {
        errorCode = 'AUTH_TOKEN_EXPIRED';
        message = 'Access token has expired';
      }

      throw err || new UnauthorizedException({
        message,
        errorCode,
      });
    }
    return user;
  }
}
