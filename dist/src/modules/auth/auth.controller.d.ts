import { AuthTokensDto, RegisteredUserDto, UserProfileDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<RegisteredUserDto>;
    login(dto: LoginDto): Promise<AuthTokensDto>;
    refresh(dto: RefreshDto): Promise<AuthTokensDto>;
    getMe(req: any): UserProfileDto;
}
//# sourceMappingURL=auth.controller.d.ts.map