import { useState, useEffect, useCallback } from 'react';
import { ReconciliationService } from '../services/reconciliation.service';
import { StatementItem, AccountingEntry } from '../types';

export const useReconciliation = (reconciliationId: string) => {
  const [statementItems, setStatementItems] = useState<StatementItem[]>([]);
  const [accountingEntries, setAccountingEntries] = useState<AccountingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reconciliationService = new ReconciliationService();

  const loadReconciliationData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real application, this would fetch data from the backend.
      // For now, using placeholder data to match the ReconciliationPanel.
      const data = {
        statementItems: [
          {
              id: 's1',
              transactionDate: new Date(),
              description: 'Salary',
              amount: 3000,
              operationType: 'CREDIT',
              suggestedCategory: { name: 'SALARIO' },
              matchStatus: 'PENDING',
              matchType: 'PENDING'
          },
          {
              id: 's2',
              transactionDate: new Date(),
              description: 'Rent',
              amount: 1000,
              operationType: 'DEBIT',
              suggestedCategory: { name: 'ALUGUEL' },
              matchStatus: 'PENDING',
              matchType: 'PENDING'
          }
      ],
      accountingEntries: [
          {
              id: 'a1',
              transactionDate: new Date(),
              description: 'Monthly Salary',
              amount: 3000,
              operationType: 'CREDIT',
              status: 'PENDING'
          },
          {
              id: 'a2',
              transactionDate: new Date(),
              description: 'Office Rent',
              amount: 1000,
              operationType: 'DEBIT',
              status: 'PENDING'
          }
      ]
      };
      setStatementItems(data.statementItems);
      setAccountingEntries(data.accountingEntries);
    } catch (err: any) {
      setError(err.message || 'Failed to load reconciliation data.');
    } finally {
      setLoading(false);
    }
  }, [reconciliationId]);

  useEffect(() => {
    if (reconciliationId) {
      loadReconciliationData();
    }
  }, [reconciliationId, loadReconciliationData]);

  return { statementItems, accountingEntries, loading, error, reload: loadReconciliationData };
};
