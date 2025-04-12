import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'site' })
export class Site extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 256,
    name: 'name'
  })
  name: string;

  @Column({
    type: 'int',
    name: 'working_hours_per_day',
    default: 8
  })
  workingHrsPerDay: number;

  @Column({
    type: 'int',
    name: 'contracted_days',
    nullable: true
  })
  contractedDays: number;

  @OneToMany(() => User, (user) => user.site, { onDelete: 'CASCADE' })
  users: User[];
}
