import { AuthTokensDto, RegisteredUserDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<RegisteredUserDto>;
    login(dto: LoginDto): Promise<AuthTokensDto>;
}
//# sourceMappingURL=auth.controller.d.ts.map