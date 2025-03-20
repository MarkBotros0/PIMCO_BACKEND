import {
  BadRequestException,
  ForbiddenException,
  Injectable
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { TokenService } from './token.service';
import { LoginDto } from '../dtos/login.dto';
import * as argon2 from 'argon2';
import { CreateUserDto } from '../../users/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await argon2.hash(createUserDto.password);
    return await this.usersService.createUserRequest(createUserDto);
  }

  async login(loginDto: LoginDto): Promise<User> {
    const user: User = await this.usersService.findOneByPhoneNumber(
      loginDto.phoneNumber
    );

    if (!user.isActive || !user) {
      throw new ForbiddenException('User is not found or not activated');
    }

    const isOtpVerified: boolean = await argon2.verify(
      user.password,
      loginDto.password
    );
    if (!isOtpVerified) throw new BadRequestException('password is incorrect');

    return await this.usersService.findOneByPhoneNumber(loginDto.phoneNumber);
  }

  async logout(refreshToken: any): Promise<void> {
    await this.tokenService.addTokenToBlacklist(refreshToken);
  }
}
