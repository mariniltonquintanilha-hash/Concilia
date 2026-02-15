import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';

export type UserRole = 'ADMIN' | 'MANAGER' | 'ANALYST' | 'AUDITOR';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 20, default: 'ANALYST' })
  role: UserRole;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
