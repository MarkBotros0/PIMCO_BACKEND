import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { UserRole } from '../enums/user-roles.enum';
import { BlacklistedRefreshToken } from '../../auth/entities/blacklisted-refresh-token.entity';
import { EmployeeType } from '../enums/employee-type.enum';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ name: 'phone_number', unique: true, type: 'varchar', length: 15 })
  phoneNumber: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true
  })
  fullname: string;

  @Column({
    type: 'text',
    nullable: true
  })
  password: string;

  @Column({
    type: 'enum',
    name: 'user_roles',
    enum: UserRole,
    default: [UserRole.NORMAL],
    array: true,
  })
  roles: UserRole[];

  @Column({
    type: 'enum',
    name: 'emplyee_type',
    enum: EmployeeType,
    nullable: true
  })
  employeeType?: EmployeeType;

  @Column({
    type: 'date',
    name: 'date_of_birth',
    nullable: true
  })
  dateOfBirth: Date;

  @OneToMany(() => BlacklistedRefreshToken, (token) => token.user, {
    cascade: true
  })
  blacklistedRefreshTokens: BlacklistedRefreshToken[];

}
