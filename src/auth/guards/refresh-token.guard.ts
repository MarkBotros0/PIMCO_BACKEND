import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenService } from '../services/token.service';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly blacklistService: TokenService) {
    super();
  }

  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token: string = request
      .get('authorization')
      ?.replace('Bearer', '')
      .trim();

    return !(await this.blacklistService.isTokenBlacklisted(token));
  }
}
