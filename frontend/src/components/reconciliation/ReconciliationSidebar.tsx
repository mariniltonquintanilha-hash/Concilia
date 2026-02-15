import React from 'react';
import { StatementItem, AccountingEntry } from '../../types';

interface ReconciliationSidebarProps {
  statementItems: StatementItem[];
  accountingEntries: AccountingEntry[];
}

const ReconciliationSidebar: React.FC<ReconciliationSidebarProps> = ({
  statementItems,
  accountingEntries,
}) => {
  const totalStatementItems = statementItems.length;
  const totalAccountingEntries = accountingEntries.length;
  const matchedStatementItems = statementItems.filter(item => item.matchStatus === 'MATCHED').length;
  const matchedAccountingEntries = accountingEntries.filter(item => item.status === 'RECONCILED').length;
  const pendingStatementItems = totalStatementItems - matchedStatementItems;
  const pendingAccountingEntries = totalAccountingEntries - matchedAccountingEntries;

  return (
    <div className="w-64 bg-white border-r p-4 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumo da Conciliação</h3>

      <div className="mb-6">
        <p className="text-sm text-gray-600">Extrato Bancário:</p>
        <p className="text-md font-medium">Total de Itens: {totalStatementItems}</p>
        <p className="text-md text-green-600">Conciliados: {matchedStatementItems}</p>
        <p className="text-md text-yellow-600">Pendentes: {pendingStatementItems}</p>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-600">Razão Contábil:</p>
        <p className="text-md font-medium">Total de Lançamentos: {totalAccountingEntries}</p>
        <p className="text-md text-green-600">Conciliados: {matchedAccountingEntries}</p>
        <p className="text-md text-yellow-600">Pendentes: {pendingAccountingEntries}</p>
      </div>

      {/* Adicionar mais estatísticas conforme necessário */}
      <div className="mt-auto pt-4 border-t">
        <p className="text-sm text-gray-500">Última atualização: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default ReconciliationSidebar;
