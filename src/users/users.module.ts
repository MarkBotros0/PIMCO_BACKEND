import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserDocuments } from './entities/user-documents.entity';
import { EmployeeTypeEntity } from './entities/employee-type.entity';
import { PayrollsModule } from '../payrolls/payrolls.module';
import { SalaryDetails } from './entities/salary-details.entity';
import { SitesModule } from '../sites/sites.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserDocuments,
      EmployeeTypeEntity,
      SalaryDetails
    ]),
    PayrollsModule,
    SitesModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
