import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
// import { Permission } from './entities/permission.entity';
// import { RolePermission } from './entities/role-permission.entity';

@Injectable()
export class AccessControlService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // @InjectRepository(Permission)
    // private permissionRepository: Repository<Permission>,
    // @InjectRepository(RolePermission)
    // private rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async verifyPermission(userId: string, permissionCode: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      throw new ForbiddenException('Usuário não autorizado');
    }
    
    // This is a placeholder. In a real implementation, you would check
    // the user's role and the permissions associated with that role.
    if (user.role === 'ANALYST' && permissionCode.includes('APPROVE')) {
        throw new ForbiddenException(`Permissão insuficiente: ${permissionCode}`);
    }
    
    console.log(`User ${userId} has permission for ${permissionCode}`);
  }

  async checkClosedPeriod(date: Date): Promise<void> {
    // Implement logic to check if the accounting period for the given date is closed.
    // For example, periods older than 30 days might be closed.
    const today = new Date();
    const daysDifference = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDifference > 30) {
        // throw new ForbiddenException("Período já fechado");
    }
  }

  async checkRetroactivePermission(
    userId: string,
    targetDate: Date
  ): Promise<boolean> {
    await this.verifyPermission(userId, 'RETROACTIVE_ENTRY');

    const today = new Date();
    const maxRetroactiveDays = 30;
    const daysDifference = Math.floor(
      (today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDifference > maxRetroactiveDays) {
      throw new ForbiddenException(
        `Lançamentos retroativos permitidos apenas até ${maxRetroactiveDays} dias`
      );
    }

    return true;
  }

  async getAccessibleAccounts(userId: string): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      // relations: ['assignedAccounts'], // Assuming a relation exists
    });

    if (user.role === 'ADMIN' || user.role === 'MANAGER') {
      return []; // Array vazio significa acesso a todas as contas
    }

    // In a real implementation, you would return the accounts assigned to the user.
    // return user.assignedAccounts.map(account => account.id);
    return ["account1-id", "account2-id"]; // Placeholder
  }
}
