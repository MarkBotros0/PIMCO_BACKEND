import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from '../../users/enums/user-roles.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const roles = request.user?.roles;

    if (request.user && roles.includes(UserRole.ADMIN)) {
      request.isAdmin = true;
      return true;
    }

    return false;
  }
}
