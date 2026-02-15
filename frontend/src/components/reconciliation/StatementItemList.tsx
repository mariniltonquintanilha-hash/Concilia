import React from 'react';
import { StatementItem } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface StatementItemListProps {
  items: StatementItem[];
  selectedItem: string | null;
  onSelectItem: (id: string) => void;
}

const StatementItemList: React.FC<StatementItemListProps> = ({
  items,
  selectedItem,
  onSelectItem,
}) => {
  const getStatusColor = (item: StatementItem) => {
    switch (item.matchStatus) {
      case 'MATCHED':
        return 'bg-green-50 border-l-4 border-green-500';
      case 'DIVERGENCE':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'PENDING':
        return 'bg-yellow-50 border-l-4 border-yellow-500';
      default:
        return 'bg-white';
    }
  };

  const getMatchTypeBadge = (item: StatementItem) => {
    switch (item.matchType) {
      case 'AUTO':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Automático</span>;
      case 'MANUAL':
        return <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Manual</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">Pendente</span>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-semibold text-gray-800">
          Extrato Bancário
        </h2>
        <p className="text-sm text-gray-600">
          {items.length} itens • {items.filter(i => i.matchStatus === 'MATCHED').length} conciliados
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${getStatusColor(item)} ${
              selectedItem === item.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onSelectItem(item.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {formatDate(item.transactionDate)}
                  </span>
                  {getMatchTypeBadge(item)}
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Categoria sugerida: {item.suggestedCategory?.name}
                </p>
              </div>
              
              <div className="text-right">
                <span className={`font-bold ${
                  item.operationType === 'CREDIT' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {item.operationType === 'CREDIT' ? '+' : '-'}
                  {formatCurrency(item.amount)}
                </span>
                {item.matchScore && (
                  <p className="text-xs text-gray-500 mt-1">
                    Score: {(item.matchScore * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
            
            {item.justification && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs text-yellow-800">
                  <strong>Justificativa:</strong> {item.justification}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatementItemList;
