import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { RegisterDto } from '../dtos/register.dto';
import { TokenService } from './token.service';
import { LoginDto } from '../dtos/login.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService
  ) {
  }

  async registerUser(authDto: RegisterDto): Promise<User> {
    return await this.usersService.create(authDto.phoneNumber, {
      password: authDto.password
    });
  }

  async login(loginDto: LoginDto): Promise<User> {
    const user :User=await this.usersService.findOneByPhoneNumber(loginDto.phoneNumber)
    const isOtpVerified:boolean = await argon2.verify(user.password,loginDto.password);

    if (!isOtpVerified) throw new BadRequestException('password is incorrect');

    return await this.usersService.findOneByPhoneNumber(loginDto.phoneNumber);
  }

  async logout(refreshToken: any): Promise<void> {
    await this.tokenService.addTokenToBlacklist(refreshToken);
  }
}
