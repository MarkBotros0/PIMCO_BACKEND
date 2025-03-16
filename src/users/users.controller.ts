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
import { AdminOrHRGuard } from '../auth/guards/admin-or-hr.guard';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Post(':userId/hr')
  async addHrRoleToUser(@Param('userId') userId: number) {
    await this.usersService.addHrRoleToUser(userId);
    return { message: 'Instructor role added to user' };
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Get('hr')
  async getAllHr() {
    const users: User[] = await this.usersService.getAllHrForAdmin();
    return new UserView(users).render();
  }


  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Get('requests')
  async getUserRequests() {
    const users: User[] = await this.usersService.getAllInActiveUsers();
    return new UserView(users).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Post()
  async createUserRequest(@Body() body: CreateUserDto) {
    const user:User = await this.usersService.createUserRequest(body);
    return new UserView(user).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Post('request/accept/:userId')
  async acceptUserRequest(@Param('userId') userId: number) {
    await this.usersService.acceptUserRequest(userId);
    return { message: "User Request accepted successfully" };
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Post('request/reject/:userId')
  async rejectUserRequest(@Param('userId') userId: number) {
    await this.usersService.rejectUserRequest(userId);
    return { message: "User Request accepted successfully" };
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
