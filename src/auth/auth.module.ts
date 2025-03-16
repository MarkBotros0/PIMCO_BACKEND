import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { TokenService } from './services/token.service';
import { BlacklistedRefreshToken } from './entities/blacklisted-refresh-token.entity';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
    PassportModule,
    TypeOrmModule.forFeature([BlacklistedRefreshToken])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    AccessTokenStrategy,
    RefreshTokenStrategy
  ]
})
export class AuthModule {}
