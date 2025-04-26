import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { User } from './user.entity';
import { DecimalToNumberTransformer } from '../../shared/transformers/deccimal-to-number';

@Entity({ name: 'salary-details' })
export class SalaryDetails extends BaseEntity {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'daily_salary',
    default: 0,
    transformer: DecimalToNumberTransformer
  })
  dailySalary: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'income_tax',
    default: 0,
    transformer: DecimalToNumberTransformer
  })
  incomeTax: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'social_insurance',
    default: 0,
    transformer: DecimalToNumberTransformer
  })
  socialInsurance: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'medical',
    default: 0,
    transformer: DecimalToNumberTransformer
  })
  medical: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'transportation_allowance',
    default: 0,
    transformer: DecimalToNumberTransformer
  })
  transportationAllowance: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'food_allowance',
    default: 0,
    transformer: DecimalToNumberTransformer
  })
  foodAllowance: number;

  @OneToOne(() => User, (u) => u.salaryDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;
}
