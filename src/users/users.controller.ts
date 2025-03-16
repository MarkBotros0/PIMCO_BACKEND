import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserView } from './views/user.view';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserId } from '../shared/decorators/user-id.decorator';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Post(':userId/hr')
  async addInstructorRoleToUser(@Param('userId') userId: number) {
    await this.usersService.addHrRoleToUser(userId);
    return { message: 'Instructor role added to user' };
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get('hr')
  async addAllInstructors() {
    const users: User[] = await this.usersService.getAllHrForAdmin();
    return new UserView(users).render();
  }

  @UseGuards(AccessTokenGuard)
  @Patch()
  async updateProfile(
    @UserId() userId: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const user: User = await this.usersService.update(userId, updateUserDto);
    return new UserView(user).render();
  }
}
