import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { AdminOrHRGuard } from '../auth/guards/admin-or-hr.guard';
import { EmployeeTypeEntity } from './entities/employee-type.entity';
import { EmployeeTypeView } from './views/employee-type.view';
import { CreateUserDto } from './dtos/create-user.dto';
import { NormalUserGuard } from '../auth/guards/normal-user.guard';
import { UserView } from './views/user.view';
import { UserWithDocumentsAndSalaryDetailsView } from './views/user-with-documents-salary-details.view';
import { UsersQueryDto } from './dtos/users-query.dto';

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
  @Get(':userId')
  async getUserDataById(@Req() req: any, @Param('userId') userId: number) {
    const user: User = await this.usersService.findOneById(userId);
    return new UserWithDocumentsAndSalaryDetailsView(user).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Patch(':userId')
  async updateProfile(
    @Param('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const user: User = await this.usersService.update(userId, updateUserDto);
    return new UserWithDocumentsAndSalaryDetailsView(user).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Get()
  async getAllEmployees(@Query() query: UsersQueryDto) {
    const users: User[] = await this.usersService.getAllEmployees(query);
    return new UserWithDocumentsAndSalaryDetailsView(users).render();
  }

  @UseGuards(AccessTokenGuard, AdminOrHRGuard)
  @Post('fix')
  async fix() {
    await this.usersService.fix();
    return { message: 'success' };
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
}
