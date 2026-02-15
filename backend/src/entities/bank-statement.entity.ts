import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BankAccount } from '../modules/bank-accounts/entities/bank-account.entity';
import { User } from '../modules/access-control/entities/user.entity';
import { StatementItem } from './statement-item.entity';

@Entity({ name: 'bank_statements' })
export class BankStatement extends BaseEntity {
  @Column({ name: 'bank_account_id', type: 'uuid' })
  bankAccountId: string;

  @ManyToOne(() => BankAccount)
  @JoinColumn({ name: 'bank_account_id' })
  bankAccount: BankAccount;

  @Column({ name: 'statement_date', type: 'date' })
  statementDate: Date;

  @Column({ name: 'opening_balance', type: 'decimal', precision: 15, scale: 2 })
  openingBalance: number;

  @Column({ name: 'closing_balance', type: 'decimal', precision: 15, scale: 2 })
  closingBalance: number;

  @Column({ name: 'file_name', type: 'varchar', length: 255, nullable: true })
  fileName: string;

  @Column({ name: 'file_hash', type: 'varchar', length: 64, unique: true, nullable: true })
  fileHash: string;

  @Column({ name: 'imported_by', type: 'uuid' })
  importedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'imported_by' })
  importedByUser: User;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @OneToMany(() => StatementItem, item => item.bankStatement)
  items: StatementItem[];
}
