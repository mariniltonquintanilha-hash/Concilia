import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reconciliation } from '../reconciliation/entities/reconciliation.entity';
import { ReconciliationReport, ReconciliationReportItem } from '../../types';
import { ReconciliationItem } from '../reconciliation/entities/reconciliation-item.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reconciliation)
    private reconciliationRepository: Repository<Reconciliation>,
    @InjectRepository(ReconciliationItem)
    private reconciliationItemRepository: Repository<ReconciliationItem>,
  ) {}

  async generateDcbReport(reconciliationId: string): Promise<ReconciliationReport> {
    const reconciliation = await this.reconciliationRepository.findOne({
      where: { id: reconciliationId },
      relations: ['bankAccount'],
    });

    if (!reconciliation) {
      throw new Error('Reconciliation not found');
    }

    const reconciliationItems = await this.reconciliationItemRepository.find({
      where: { reconciliationId },
      relations: ['statementItem', 'accountingEntry'],
    });

    const unmatchedItems: ReconciliationReportItem[] = [];
    let unmatchedDebits = 0;
    let unmatchedCredits = 0;

    for (const item of reconciliationItems) {
      if (item.matchStatus === 'DIVERGENCE' || item.matchStatus === 'PENDING') {
        const sourceItem = item.statementItem || item.accountingEntry;
        if (sourceItem) {
          unmatchedItems.push({
            id: sourceItem.id,
            transactionDate: sourceItem.transactionDate,
            description: sourceItem.description,
            amount: Number(sourceItem.amount),
            operationType: sourceItem.operationType as 'CREDIT' | 'DEBIT',
            justification: item.justification,
            matchStatus: item.matchStatus,
          });

          if (sourceItem.operationType === 'DEBIT') {
            unmatchedDebits += Number(sourceItem.amount);
          } else {
            unmatchedCredits += Number(sourceItem.amount);
          }
        }
      }
    }

    return {
      period: `${reconciliation.periodStart.toISOString().slice(0, 10)} a ${reconciliation.periodEnd.toISOString().slice(0, 10)}`,
      accountNumber: reconciliation.bankAccount?.accountNumber || 'N/A',
      openingBalance: Number(reconciliation.openingBalance),
      closingBalance: Number(reconciliation.calculatedBalance || 0), // Assuming calculatedBalance is eventually set
      unmatchedDebits,
      unmatchedCredits,
      unmatchedItems,
    };
  }

  async analyzeVariance(bankAccountId: string, currentPeriodEnd: Date, previousPeriods: number = 3): Promise<any> {
    // Implement variance analysis logic here
    // Compare current period with previous 'previousPeriods'
    return { message: 'Variance analysis data (placeholder)' };
  }
}
