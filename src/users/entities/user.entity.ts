import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne
} from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { UserRole } from '../enums/user-roles.enum';
import { BlacklistedRefreshToken } from '../../auth/entities/blacklisted-refresh-token.entity';
import { EmployeeTypeEntity } from './employee-type.entity';
import { UserDocuments } from './user-documents.entity';
import { Payroll } from '../../payrolls/entities/payroll.entity';

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
    type: 'text',
    nullable: true
  })
  email: string;

  @Column({
    type: 'boolean',
    name: 'is_active',
    default: false
  })
  isActive: boolean;

  @Column({
    type: 'enum',
    name: 'user_roles',
    enum: UserRole,
    default: [UserRole.NORMAL],
    array: true
  })
  roles: UserRole[];

  @Column({
    type: 'date',
    name: 'date_of_birth',
    nullable: true
  })
  dateOfBirth: Date;

  @Column({
    type: 'text',
    name: 'address',
    nullable: true
  })
  address: string;

  @ManyToOne(() => EmployeeTypeEntity, (type) => type.users, { nullable: true })
  @JoinColumn({ name: 'employee_type' })
  employeeType: EmployeeTypeEntity;

  @OneToMany(() => BlacklistedRefreshToken, (token) => token.user, {
    cascade: true
  })
  blacklistedRefreshTokens: BlacklistedRefreshToken[];

  @OneToOne(() => UserDocuments, (documents) => documents.user)
  documents: UserDocuments;

  @OneToMany(() => Payroll, (payroll) => payroll.user)
  payrolls: Payroll;
}
