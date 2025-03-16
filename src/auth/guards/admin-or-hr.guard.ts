import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from '../../users/enums/user-roles.enum';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AdminOrHRGuard implements CanActivate {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles: UserRole[] = request.user?.userRoles;
    const userId: number = request.user?.id;

    if (request.user) {
      if (roles.includes(UserRole.ADMIN)) {
        request.isAdmin = true;
        return true;
      }

      if (roles.includes(UserRole.HUMAN_RESOURCES)) {
        request.instructor = await this.entityManager.findOne(User, {
          where: { id: userId, roles: UserRole.HUMAN_RESOURCES }
        });
        request.isAdmin = false;
        return true;
      }
    }
    return false;
  }
}
