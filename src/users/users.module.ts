import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserDocuments } from './entities/user-documents.entity';
import { EmployeeTypeEntity } from './entities/employee-type.entity';
import { PayrollsModule } from '../payrolls/payrolls.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserDocuments, EmployeeTypeEntity]),
    PayrollsModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
