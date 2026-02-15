import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from './user.entity'; // User entity now defines the role
import { Permission } from './permission.entity';

@Entity({ name: 'role_permissions' })
export class RolePermission {
  @PrimaryColumn({ name: 'role' })
  role: string; // Assuming role is a string directly from User entity

  @PrimaryColumn({ name: 'permission_id' })
  permissionId: string;

  @ManyToOne(() => Permission)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  // Add a relation to User if needed to directly map permissions to user roles
  // @ManyToOne(() => User, user => user.rolePermissions)
  // @JoinColumn({ name: 'role', referencedColumnName: 'role' })
  // user: User;
}
