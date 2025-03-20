import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'employee_type' })
export class EmployeeTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'name_ar'
  })
  name_ar: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'name_en',
    nullable: true
  })
  name_en: string;

  @OneToMany(() => User, (user) => user.employeeType)
  users: User[];
}
