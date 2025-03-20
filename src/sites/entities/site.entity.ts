import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity({ name: 'site' })
export class Site extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 256,
    name: 'name'
  })
  name: string;
}
