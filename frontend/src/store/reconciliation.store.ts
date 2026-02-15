import { create } from 'zustand';
import { StatementItem, AccountingEntry } from '../types';

interface ReconciliationState {
  currentReconciliationId: string | null;
  statementItems: StatementItem[];
  accountingEntries: AccountingEntry[];
  selectedStatementItem: string | null;
  selectedAccountingEntry: string | null;
  setReconciliationData: (statementItems: StatementItem[], accountingEntries: AccountingEntry[]) => void;
  setSelectedStatementItem: (id: string | null) => void;
  setSelectedAccountingEntry: (id: string | null) => void;
  setCurrentReconciliationId: (id: string | null) => void;
  // Add more state and actions as needed for reconciliation UI
}

export const useReconciliationStore = create<ReconciliationState>((set) => ({
  currentReconciliationId: null,
  statementItems: [],
  accountingEntries: [],
  selectedStatementItem: null,
  selectedAccountingEntry: null,
  setReconciliationData: (statementItems, accountingEntries) =>
    set({ statementItems, accountingEntries }),
  setSelectedStatementItem: (id) => set({ selectedStatementItem: id }),
  setSelectedAccountingEntry: (id) => set({ selectedAccountingEntry: id }),
  setCurrentReconciliationId: (id) => set({ currentReconciliationId: id }),
}));
