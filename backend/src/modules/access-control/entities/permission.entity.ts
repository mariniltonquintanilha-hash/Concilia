import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
// import { Role } from './role.entity'; // Assuming Role entity exists or role is directly on user

@Entity({ name: 'permissions' })
export class Permission extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  description: string;

  // @ManyToMany(() => Role, role => role.permissions)
  // @JoinTable({
  //   name: 'role_permissions',
  //   joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  // })
  // roles: Role[];
}
