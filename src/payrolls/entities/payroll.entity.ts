import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'payrolls' })
export class Payroll extends BaseEntity {
  @Column({ type: 'int', name: 'month' })
  month: number;

  @Column({ type: 'int', name: 'year' })
  year: number;

  @ManyToOne(() => User, (user) => user.payrolls, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({
    type: 'boolean',
    name: 'approval_status',
    default: true
  })
  approvalStatus: boolean;

  @Column({
    type: 'int',
    name: 'attendance',
    default: 0
  })
  attendance: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'overtime_in_hrs',
    default: 0
  })
  overtimeInHours: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'total_attendance',
    default: 0
  })
  totalAttendance: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'income_tax',
    default: 0
  })
  incomeTax: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'penalties',
    default: 0
  })
  penalties: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'advances',
    default: 0
  })
  advances: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'social_insurance',
    default: 0
  })
  socialInsurance: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'total_deductions',
    default: 0
  })
  totalDeductions: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'medical',
    default: 0
  })
  medical: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'bonuses_and_allowances',
    default: 0
  })
  bonusesAndAllowances: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'transportation_allowance',
    default: 0
  })
  transportationAllowance: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'food_allowance',
    default: 0
  })
  foodAllowance: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'daily_difference',
    default: 0
  })
  dailyDifference: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'currency_difference',
    default: 0
  })
  currencyDifference: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'net_salary',
    default: 0
  })
  netSalary: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'total_salary',
    default: 0
  })
  totalSalary: number;

  @Column({
    type: 'boolean',
    name: 'is_past',
    default: false
  })
  isPast: boolean;
}
