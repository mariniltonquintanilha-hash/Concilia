import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BankStatement } from './bank-statement.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { AccountingEntry } from '../modules/accounting/entities/accounting-entry.entity';

export type MatchType = 'AUTO' | 'MANUAL' | 'PENDING';

@Entity({ name: 'statement_items' })
export class StatementItem extends BaseEntity {
  @Column({ name: 'statement_id', type: 'uuid' })
  statementId: string;

  @ManyToOne(() => BankStatement, statement => statement.items)
  @JoinColumn({ name: 'statement_id' })
  bankStatement: BankStatement;

  @Column({ name: 'transaction_date', type: 'date' })
  transactionDate: Date;

  @Column({ name: 'value_date', type: 'date', nullable: true })
  valueDate: Date;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ name: 'operation_type', type: 'varchar', length: 10 })
  operationType: 'CREDIT' | 'DEBIT';

  @Column({ name: 'suggested_category_id', type: 'uuid', nullable: true })
  suggestedCategoryId: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'suggested_category_id' })
  suggestedCategory: Category;

  @Column({ name: 'matched_entry_id', type: 'uuid', nullable: true })
  matchedEntryId: string;

  @ManyToOne(() => AccountingEntry)
  @JoinColumn({ name: 'matched_entry_id' })
  matchedEntry: AccountingEntry;

  @Column({ name: 'match_type', type: 'varchar', length: 20, nullable: true })
  matchType: MatchType;

  @Column({ name: 'match_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  matchScore: number;
}
