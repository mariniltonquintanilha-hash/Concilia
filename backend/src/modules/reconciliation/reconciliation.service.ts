import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import {
  Reconciliation,
} from './entities/reconciliation.entity';
import { ReconciliationItem } from './entities/reconciliation-item.entity';
import { BankStatement } from '../../entities/bank-statement.entity';
import { StatementItem } from '../../entities/statement-item.entity';
import { AccountingEntry } from '../accounting/entities/accounting-entry.entity';
import { AuditService } from '../audit/audit.service';
import { AccessControlService } from '../access-control/access-control.service';

@Injectable()
export class ReconciliationService {
  constructor(
    @InjectRepository(Reconciliation)
    private reconciliationRepository: Repository<Reconciliation>,
    @InjectRepository(ReconciliationItem)
    private itemRepository: Repository<ReconciliationItem>,
    @InjectRepository(StatementItem)
    private statementItemRepository: Repository<StatementItem>,
    @InjectRepository(AccountingEntry)
    private accountingEntryRepository: Repository<AccountingEntry>,
    @InjectRepository(BankStatement)
    private bankStatementRepository: Repository<BankStatement>,
    private auditService: AuditService,
    private accessControl: AccessControlService
  ) {}

  async createReconciliation(
    periodStart: Date,
    periodEnd: Date,
    bankAccountId: string,
    userId: string
  ): Promise<Reconciliation> {
    // Verificar se período já está fechado
    await this.accessControl.checkClosedPeriod(periodStart);

    // Buscar lançamentos contábeis do período
    const accountingEntries = await this.accountingEntryRepository.find({
      where: {
        bankAccountId,
        transactionDate: Between(periodStart, periodEnd),
        status: 'PENDING',
      },
    });

    // Buscar itens do extrato do período
    const statements = await this.getStatementsForPeriod(
      bankAccountId,
      periodStart,
      periodEnd
    );

    const statementItems: StatementItem[] = [];
    for (const statement of statements) {
      const items = await this.statementItemRepository.find({
        where: { statementId: statement.id, matchType: 'PENDING' },
      });
      statementItems.push(...items);
    }

    // Criar reconciliação
    const reconciliation = this.reconciliationRepository.create({
      periodStart,
      periodEnd,
      bankAccountId,
      performedBy: userId,
      openingBalance: statements[0]?.openingBalance || 0,
      status: 'OPEN',
    });

    const savedReconciliation = await this.reconciliationRepository.save(reconciliation);

    // Realizar match automático
    await this.autoMatchItems(
      savedReconciliation.id,
      accountingEntries,
      statementItems
    );

    return savedReconciliation;
  }

    private async getStatementsForPeriod(bankAccountId: string, periodStart: Date, periodEnd: Date): Promise<BankStatement[]> {
        return this.bankStatementRepository.find({
            where: {
                bankAccountId,
                statementDate: Between(periodStart, periodEnd)
            }
        });
    }

  private async autoMatchItems(
    reconciliationId: string,
    accountingEntries: AccountingEntry[],
    statementItems: StatementItem[]
  ): Promise<void> {
    for (const entry of accountingEntries) {
      const bestMatch = this.findBestMatch(entry, statementItems);
      
      if (bestMatch && bestMatch.score >= 0.95) { // 95% de similaridade
        await this.createReconciliationItem(
          reconciliationId,
          bestMatch.item.id,
          entry.id,
          'MATCHED',
        );

        // Atualizar status dos itens
        await this.statementItemRepository.update(bestMatch.item.id, {
          matchType: 'AUTO',
          matchedEntryId: entry.id,
          matchScore: bestMatch.score,
        });

        await this.accountingEntryRepository.update(entry.id, {
          status: 'RECONCILED',
        });
      }
    }
  }

  private findBestMatch(
    entry: AccountingEntry,
    items: StatementItem[]
  ): { item: StatementItem; score: number } | null {
    let bestMatch: StatementItem | null = null;
    let bestScore = 0;

    for (const item of items) {
      // Filter out items that are already matched
      if (item.matchType !== 'PENDING') continue;

      // Verificar correspondência exata de data e valor
      const dateMatch = this.compareDates(
        entry.transactionDate,
        item.transactionDate
      );
      const amountMatch = Math.abs(Number(entry.amount) - Number(item.amount)) < 0.01;
      
      if (dateMatch && amountMatch) {
        // Calcular similaridade das descrições
        const descriptionScore = this.calculateSimilarity(
          entry.description,
          item.description
        );
        
        const totalScore = descriptionScore * 0.7 + (dateMatch ? 0.2 : 0) + (amountMatch ? 0.1 : 0);
        
        if (totalScore > bestScore) {
          bestScore = totalScore;
          bestMatch = item;
        }
      }
    }

    return bestMatch ? { item: bestMatch, score: bestScore } : null;
  }

  async manualReconcile(
    reconciliationId: string,
    statementItemId: string,
    accountingEntryId: string,
    userId: string
  ): Promise<ReconciliationItem> {
    const reconciliation = await this.reconciliationRepository.findOne({
      where: { id: reconciliationId },
    });

    if (reconciliation.status !== 'OPEN') {
      throw new ForbiddenException('Período de reconciliação não está aberto');
    }

    const reconciliationItem = await this.createReconciliationItem(
      reconciliationId,
      statementItemId,
      accountingEntryId,
      'MATCHED',
    );

    // Atualizar status dos itens
    await this.statementItemRepository.update(statementItemId, {
      matchType: 'MANUAL',
      matchedEntryId: accountingEntryId,
      matchScore: 1.0,
    });

    await this.accountingEntryRepository.update(accountingEntryId, {
      status: 'RECONCILED',
    });

    await this.auditService.logManualReconciliation(
      userId,
      reconciliationItem.id
    );

    return reconciliationItem;
  }

  async reportDivergence(
    reconciliationId: string,
    statementItemId: string | null,
    accountingEntryId: string | null,
    divergenceType: string,
    divergenceAmount: number,
    justification: string,
    userId: string
  ): Promise<ReconciliationItem> {
    // Princípio do Segundo Olhar: Verificar permissões
    await this.accessControl.verifyPermission(userId, 'REPORT_DIVERGENCE');

    const reconciliationItem = await this.createReconciliationItem(
      reconciliationId,
      statementItemId,
      accountingEntryId,
      'DIVERGENCE',
      divergenceType,
      divergenceAmount,
      justification
    );

    await this.auditService.logDivergence(userId, reconciliationItem.id, justification);

    return reconciliationItem;
  }

  private async createReconciliationItem(
    reconciliationId: string,
    statementItemId: string | null,
    accountingEntryId: string | null,
    matchStatus: 'MATCHED' | 'DIVERGENCE' | 'PENDING' | 'IGNORED',
    divergenceType?: string,
    divergenceAmount?: number,
    justification?: string
  ): Promise<ReconciliationItem> {
      const item = this.itemRepository.create({
          reconciliationId,
          statementItemId,
          accountingEntryId,
          matchStatus,
          divergenceType,
          divergenceAmount,
          justification
      });
      return this.itemRepository.save(item);
  }

  async submitForReview(
    reconciliationId: string,
    userId: string
  ): Promise<void> {
    const reconciliation = await this.reconciliationRepository.findOne({
      where: { id: reconciliationId },
    });

    // Verificar se há divergências não justificadas
    const pendingDivergences = await this.itemRepository.count({
      where: {
        reconciliationId,
        matchStatus: 'DIVERGENCE',
        justification: null,
      },
    });

    if (pendingDivergences > 0) {
      throw new Error('Existem divergências sem justificativa');
    }

    // Validar equilíbrio contábil
    await this.validateAccountingBalance(reconciliationId);

    await this.reconciliationRepository.update(reconciliationId, { status: 'IN_REVIEW' });

    await this.auditService.logReviewSubmission(userId, reconciliationId);
  }

  async approveReconciliation(
    reconciliationId: string,
    reviewerId: string,
    comments?: string
  ): Promise<void> {
    const reconciliation = await this.reconciliationRepository.findOne({
      where: { id: reconciliationId },
      relations: ['performedByUser'],
    });

    if (reconciliation.performedByUser.id === reviewerId) {
      throw new ForbiddenException(
        'O revisor deve ser diferente do executor da reconciliação'
      );
    }

    await this.accessControl.verifyPermission(reviewerId, 'APPROVE_RECONCILIATION');

    const updatePayload: Partial<Reconciliation> = {
        status: 'APPROVED',
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
    };
    
    if (comments) {
      updatePayload.justification = reconciliation.justification 
        ? `${reconciliation.justification}\nReviewer Comments: ${comments}`
        : `Reviewer Comments: ${comments}`;
    }

    await this.reconciliationRepository.update(reconciliationId, updatePayload);
    await this.auditService.logApproval(reviewerId, reconciliationId, comments);
  }

  private async validateAccountingBalance(reconciliationId: string): Promise<void> {
    const items = await this.itemRepository.find({
      where: { reconciliationId },
      relations: ['statementItem', 'accountingEntry'],
    });

    let totalDebits = 0;
    let totalCredits = 0;

    for (const item of items) {
      if (item.accountingEntry) {
        if (item.accountingEntry.operationType === 'DEBIT') {
          totalDebits += Number(item.accountingEntry.amount);
        } else {
          totalCredits += Number(item.accountingEntry.amount);
        }
      }
    }

    const difference = Math.abs(totalDebits - totalCredits);
    
    if (difference > 0.01) { // Tolerância de 1 centavo
      throw new Error(
        `Desequilíbrio contábil detectado: Débitos: ${totalDebits}, Créditos: ${totalCredits}, Diferença: ${difference}`
      );
    }
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const jaroWinkler = require('jaro-winkler');
    return jaroWinkler(str1.toLowerCase(), str2.toLowerCase());
  }

  private compareDates(date1: Date, date2: Date): boolean {
    if (!date1 || !date2) return false;
    return new Date(date1).toDateString() === new Date(date2).toDateString();
  }
}
