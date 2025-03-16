import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'blacklisted_refresh_tokens' })
export class BlacklistedRefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'token', type: 'text' })
  token: string;

  @CreateDateColumn({
    name: 'expired_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  expiredAt: Date;

  @ManyToOne(() => User, (user: User) => user.blacklistedRefreshTokens, {
    onDelete: 'CASCADE'
  })
  user: User;
}
