import React from 'react';
import { AccountingEntry } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface AccountingEntryListProps {
  entries: AccountingEntry[];
  selectedEntry: string | null;
  onSelectEntry: (id: string) => void;
}

const AccountingEntryList: React.FC<AccountingEntryListProps> = ({
  entries,
  selectedEntry,
  onSelectEntry,
}) => {
  const getStatusColor = (entry: AccountingEntry) => {
    switch (entry.status) {
      case 'RECONCILED':
        return 'bg-green-50 border-l-4 border-green-500';
      case 'DIVERGENCE': // Assuming divergence status for accounting entries
        return 'bg-red-50 border-l-4 border-red-500';
      case 'PENDING':
        return 'bg-yellow-50 border-l-4 border-yellow-500';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-semibold text-gray-800">
          Razão Contábil
        </h2>
        <p className="text-sm text-gray-600">
          {entries.length} lançamentos • {entries.filter(e => e.status === 'RECONCILED').length} conciliados
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${getStatusColor(entry)} ${
              selectedEntry === entry.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onSelectEntry(entry.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-medium text-gray-900">
                  {formatDate(entry.transactionDate)}
                </span>
                <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
              </div>
              <div className="text-right">
                <span className={`font-bold ${
                  entry.operationType === 'CREDIT' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {entry.operationType === 'CREDIT' ? '+' : '-'}
                  {formatCurrency(entry.amount)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountingEntryList;
