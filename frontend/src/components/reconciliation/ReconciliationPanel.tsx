import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ReconciliationService } from '../../services/reconciliation.service';
import { StatementItem, AccountingEntry } from '../../types';
import ReconciliationSidebar from './ReconciliationSidebar';
import StatementItemList from './StatementItemList';
import AccountingEntryList from './AccountingEntryList';
import ReconciliationActions from './ReconciliationActions';
import { useAudit } from '../../hooks/useAudit';

const ReconciliationPanel: React.FC = () => {
  const { reconciliationId } = useParams<{ reconciliationId: string }>();
  const [statementItems, setStatementItems] = useState<StatementItem[]>([]);
  const [accountingEntries, setAccountingEntries] = useState<AccountingEntry[]>([]);
  const [selectedStatementItem, setSelectedStatementItem] = useState<string | null>(null);
  const [selectedAccountingEntry, setSelectedAccountingEntry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { logAction } = useAudit();

  const reconciliationService = new ReconciliationService();

  useEffect(() => {
    loadReconciliationData();
  }, [reconciliationId]);

  const loadReconciliationData = async () => {
    try {
      // Placeholder data
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
      // const data = await reconciliationService.getReconciliationData(reconciliationId!);
      // setStatementItems(data.statementItems);
      // setAccountingEntries(data.accountingEntries);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualMatch = async () => {
    if (!selectedStatementItem || !selectedAccountingEntry) {
      alert('Selecione um item do extrato e um lançamento contábil');
      return;
    }

    try {
      await reconciliationService.manualMatch(
        reconciliationId!,
        selectedStatementItem,
        selectedAccountingEntry
      );
      
      await logAction('MANUAL_RECONCILIATION', {
        reconciliationId,
        statementItemId: selectedStatementItem,
        accountingEntryId: selectedAccountingEntry,
      });

      // Atualizar dados
      loadReconciliationData();
      
      // Limpar seleções
      setSelectedStatementItem(null);
      setSelectedAccountingEntry(null);
      
    } catch (error) {
      console.error('Erro ao conciliar:', error);
    }
  };

  const handleReportDivergence = async (justification: string) => {
    if (!selectedStatementItem || !selectedAccountingEntry) {
      alert('Selecione um item do extrato e um lançamento contábil');
      return;
    }

    try {
      await reconciliationService.reportDivergence(
        reconciliationId!,
        selectedStatementItem,
        selectedAccountingEntry,
        justification
      );

      await logAction('REPORT_DIVERGENCE', {
        reconciliationId,
        statementItemId: selectedStatementItem,
        accountingEntryId: selectedAccountingEntry,
        justification,
      });

      loadReconciliationData();
      setSelectedStatementItem(null);
      setSelectedAccountingEntry(null);
      
    } catch (error) {
      console.error('Erro ao reportar divergência:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar com estatísticas */}
      <ReconciliationSidebar
        statementItems={statementItems}
        accountingEntries={accountingEntries}
      />

      {/* Painel principal */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex border-t">
          {/* Extrato Bancário */}
          <div className="flex-1 border-r">
            <StatementItemList
              items={statementItems}
              selectedItem={selectedStatementItem}
              onSelectItem={setSelectedStatementItem}
            />
          </div>

          {/* Razão Contábil */}
          <div className="flex-1">
            <AccountingEntryList
              entries={accountingEntries}
              selectedEntry={selectedAccountingEntry}
              onSelectEntry={setSelectedAccountingEntry}
            />
          </div>
        </div>

        {/* Ações */}
        <ReconciliationActions
          onManualMatch={handleManualMatch}
          onReportDivergence={handleReportDivergence}
          selectedStatementItem={selectedStatementItem}
          selectedAccountingEntry={selectedAccountingEntry}
        />
      </div>
    </div>
  );
};

export default ReconciliationPanel;
