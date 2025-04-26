import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserWithDocumentsView } from './views/user-with-documents.view';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserId } from '../shared/decorators/user-id.decorator';
import { AdminOrHRGuard } from '../auth/guards/admin-or-hr.guard';
import { EmployeeTypeEntity } from './entities/employee-type.entity';
import { EmployeeTypeView } from './views/employee-type.view';
import { CreateUserDto } from './dtos/create-user.dto';
import { NormalUserGuard } from '../auth/guards/normal-user.guard';
import { UserView } from './views/user.view';
import { UserWithDocumentsAndSalaryDetailsView } from './views/user-with-documents-salary-details.view';

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

  @UseGuards(AccessTokenGuard, NormalUserGuard)
  @Get('me')
  async getUserData(@Req() req: any) {
    const userId: number = req?.user?.id;
    const user: User = await this.usersService.findOneById(userId);
    return new UserWithDocumentsView(user).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Get()
  async getAllEmployees() {
    const users: User[] = await this.usersService.getAllEmployees();
    return new UserWithDocumentsAndSalaryDetailsView(users).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Get('requests')
  async getUserRequests() {
    const users: User[] = await this.usersService.getAllInActiveUsers();
    return new UserWithDocumentsView(users).render();
  }

  @Get('employee-types')
  async getEmpolyeeTypes() {
    const employeeTypes: EmployeeTypeEntity[] =
      await this.usersService.getEmployeeTypes();
    return new EmployeeTypeView(employeeTypes).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Post('request/accept/:userId')
  async acceptUserRequest(@Param('userId') userId: number) {
    await this.usersService.acceptUserRequest(userId);
    return { message: 'User Request accepted successfully' };
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Post('request/reject/:userId')
  async rejectUserRequest(@Param('userId') userId: number) {
    await this.usersService.rejectUserRequest(userId);
    return { message: 'User Request accepted successfully' };
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Post()
  async createUserByAdmin(@Body() createUserDto: CreateUserDto) {
    const user: User = await this.usersService.createUserByAdmin(createUserDto);
    return new UserWithDocumentsView(user);
  }

  @UseGuards(AccessTokenGuard)
  @Patch()
  async updateProfile(
    @UserId() userId: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const user: User = await this.usersService.update(userId, updateUserDto);
    return new UserWithDocumentsView(user).render();
  }
}
