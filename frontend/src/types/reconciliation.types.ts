// Defines types related to reconciliation processes
export interface ReconciliationSummary {
    totalMatched: number;
    totalPending: number;
    totalDivergences: number;
    // Add more summary fields as needed
  }
  
  export interface ReconciliationReportItem {
    id: string;
    transactionDate: Date;
    description: string;
    amount: number;
    operationType: 'CREDIT' | 'DEBIT';
    justification?: string;
    matchStatus: 'MATCHED' | 'DIVERGENCE' | 'PENDING' | 'IGNORED';
  }
  
  export interface ReconciliationReport {
    period: string;
    accountNumber: string;
    openingBalance: number;
    closingBalance: number;
    unmatchedDebits: number;
    unmatchedCredits: number;
    unmatchedItems: ReconciliationReportItem[];
  }
  
  export interface StatementItem {
    id: string;
    transactionDate: Date;
    description: string;
    amount: number;
    operationType: 'CREDIT' | 'DEBIT';
    suggestedCategory?: { name: string };
    matchStatus?: 'MATCHED' | 'PENDING' | 'DIVERGENCE' | 'IGNORED';
    matchType?: 'AUTO' | 'MANUAL' | 'PENDING';
    matchScore?: number;
    justification?: string;
  }
  
  export interface AccountingEntry {
    id: string;
    transactionDate: Date;
    description: string;
    amount: number;
    operationType: 'CREDIT' | 'DEBIT';
    status?: 'PENDING' | 'RECONCILED' | 'IGNORED' | 'DIVERGENCE';
  }
  