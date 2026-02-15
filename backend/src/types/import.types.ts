// Defines types related to file import processes
export interface StatementItemData {
  transactionDate: string;
  description: string;
  amount: number;
  operationType: 'CREDIT' | 'DEBIT';
}

export interface ImportedStatementData {
  statementDate: string;
  openingBalance: number;
  closingBalance: number;
  items: StatementItemData[];
}
