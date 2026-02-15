import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../entities/base.entity';
import { Reconciliation } from './reconciliation.entity';
import { StatementItem } from '../../../entities/statement-item.entity';
import { AccountingEntry } from '../../accounting/entities/accounting-entry.entity';
import { User } from '../../access-control/entities/user.entity';

export type MatchStatus = 'MATCHED' | 'DIVERGENCE' | 'PENDING' | 'IGNORED';

@Entity({ name: 'reconciliation_items' })
export class ReconciliationItem extends BaseEntity {
  @Column({ name: 'reconciliation_id', type: 'uuid' })
  reconciliationId: string;

  @ManyToOne(() => Reconciliation, reconciliation => reconciliation.items)
  @JoinColumn({ name: 'reconciliation_id' })
  reconciliation: Reconciliation;

  @Column({ name: 'statement_item_id', type: 'uuid', nullable: true })
  statementItemId: string;

  @ManyToOne(() => StatementItem)
  @JoinColumn({ name: 'statement_item_id' })
  statementItem: StatementItem;

  @Column({ name: 'accounting_entry_id', type: 'uuid', nullable: true })
  accountingEntryId: string;

  @ManyToOne(() => AccountingEntry)
  @JoinColumn({ name: 'accounting_entry_id' })
  accountingEntry: AccountingEntry;

  @Column({ name: 'match_status', type: 'varchar', length: 20 })
  matchStatus: MatchStatus;

  @Column({ name: 'divergence_type', type: 'varchar', length: 50, nullable: true })
  divergenceType: string;

  @Column({ name: 'divergence_amount', type: 'decimal', precision: 15, scale: 2, nullable: true })
  divergenceAmount: number;

  @Column({ type: 'text', nullable: true })
  justification: string;

  @Column({ name: 'resolved_by', type: 'uuid', nullable: true })
  resolvedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'resolved_by' })
  resolvedByUser: User;

  @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
  resolvedAt: Date;
}
