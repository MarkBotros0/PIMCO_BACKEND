import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { AuthService } from './services/auth.service';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthTokens } from './types/auth-tokens.type';
import { LoginDto } from './dtos/login.dto';
import { TokenService } from './services/token.service';
import { User } from '../users/entities/user.entity';
import { UserView } from '../users/views/user.view';
import { RefreshToken } from './decorators/refresh-token.decorator';
import { CreateUserDto } from '../users/dtos/create-user.dto';

@Controller('auth')
@ApiSecurity('apiKey')
@ApiBearerAuth()
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ) {}

  @Post('register')
  async registerUser(@Body() body: CreateUserDto) {
    await this.authService.registerUser(body);
    return { message: 'User request Submitted Successfully' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    const user: User = await this.authService.login(body);
    const tokens: AuthTokens = await this.tokenService.getTokens(
      user.id,
      user.phoneNumber
    );
    return {
      tokens,
      user: new UserView(user).render()
    };
  }

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@RefreshToken() refreshToken: string) {
    await this.authService.logout(refreshToken);
    return {
      message: 'user has signed out successfully.'
    };
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @RefreshToken() refreshToken: string
  ): Promise<AuthTokens> {
    return this.tokenService.refreshTokens(refreshToken);
  }
}
