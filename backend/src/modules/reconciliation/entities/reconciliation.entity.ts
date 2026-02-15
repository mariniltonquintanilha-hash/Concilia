import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { BankAccount } from '../bank-accounts/entities/bank-account.entity';
import { User } from '../access-control/entities/user.entity';
import { ReconciliationItem } from './entities/reconciliation-item.entity';

export type ReconciliationStatus = 'OPEN' | 'IN_REVIEW' | 'APPROVED' | 'CLOSED';

@Entity({ name: 'reconciliations' })
export class Reconciliation extends BaseEntity {
  @Column({ name: 'period_start', type: 'date' })
  periodStart: Date;

  @Column({ name: 'period_end', type: 'date' })
  periodEnd: Date;

  @Column({ name: 'bank_account_id', type: 'uuid' })
  bankAccountId: string;

  @ManyToOne(() => BankAccount)
  @JoinColumn({ name: 'bank_account_id' })
  bankAccount: BankAccount;

  @Column({ type: 'varchar', length: 20, default: 'OPEN' })
  status: ReconciliationStatus;

  @Column({ name: 'opening_balance', type: 'decimal', precision: 15, scale: 2 })
  openingBalance: number;

  @Column({ name: 'calculated_balance', type: 'decimal', precision: 15, scale: 2, nullable: true })
  calculatedBalance: number;

  @Column({ name: 'adjusted_balance', type: 'decimal', precision: 15, scale: 2, nullable: true })
  adjustedBalance: number;

  @Column({ name: 'performed_by', type: 'uuid' })
  performedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'performed_by' })
  performedByUser: User;

  @Column({ name: 'reviewed_by', type: 'uuid', nullable: true })
  reviewedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewed_by' })
  reviewedByUser: User;

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Column({ type: 'text', nullable: true })
  justification: string;

  @Column({ name: 'closed_at', type: 'timestamp', nullable: true })
  closedAt: Date;

  @OneToMany(() => ReconciliationItem, item => item.reconciliation)
  items: ReconciliationItem[];
}
