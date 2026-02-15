import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { BankAccount } from '../../bank-accounts/entities/bank-account.entity';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../access-control/entities/user.entity';

export type OperationType = 'CREDIT' | 'DEBIT';
export type EntryStatus = 'PENDING' | 'RECONCILED' | 'IGNORED' | 'DIVERGENCE';

@Entity({ name: 'accounting_entries' })
export class AccountingEntry extends BaseEntity {
  @Column({ name: 'bank_account_id', type: 'uuid' })
  bankAccountId: string;

  @ManyToOne(() => BankAccount)
  @JoinColumn({ name: 'bank_account_id' })
  bankAccount: BankAccount;

  @Column({ name: 'transaction_date', type: 'date' })
  transactionDate: Date;

  @Column({ name: 'value_date', type: 'date', nullable: true })
  valueDate: Date;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ name: 'operation_type', type: 'varchar', length: 10 })
  operationType: OperationType;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: EntryStatus;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;
}
