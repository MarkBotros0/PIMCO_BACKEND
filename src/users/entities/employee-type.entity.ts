import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'employee_type' })
export class EmployeeTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'type'
  })
  type: string;

  @OneToMany(() => User,(user) => user.employeeType)
  users: User[];
}
