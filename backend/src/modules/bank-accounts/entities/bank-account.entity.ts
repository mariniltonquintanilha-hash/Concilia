import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { Institution } from './institution.entity';

export type AccountType = 'CHECKING' | 'SAVINGS' | 'INVESTMENT';

@Entity({ name: 'bank_accounts' })
@Unique(['institution', 'accountNumber', 'agency'])
export class BankAccount extends BaseEntity {
  @Column({ name: 'institution_id', type: 'uuid' })
  institutionId: string;

  @ManyToOne(() => Institution)
  @JoinColumn({ name: 'institution_id' })
  institution: Institution;

  @Column({ name: 'account_number', type: 'varchar', length: 50 })
  accountNumber: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  agency: string;

  @Column({ name: 'account_type', type: 'varchar', length: 20 })
  accountType: AccountType;
}
