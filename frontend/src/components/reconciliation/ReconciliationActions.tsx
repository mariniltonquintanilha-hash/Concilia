import React, { useState } from 'react';

interface ReconciliationActionsProps {
  onManualMatch: () => void;
  onReportDivergence: (justification: string) => void;
  selectedStatementItem: string | null;
  selectedAccountingEntry: string | null;
}

const ReconciliationActions: React.FC<ReconciliationActionsProps> = ({
  onManualMatch,
  onReportDivergence,
  selectedStatementItem,
  selectedAccountingEntry,
}) => {
  const [justification, setJustification] = useState('');
  const canPerformAction = selectedStatementItem && selectedAccountingEntry;

  return (
    <div className="p-4 bg-white border-t flex items-center space-x-4">
      <button
        onClick={onManualMatch}
        disabled={!canPerformAction}
        className={`px-4 py-2 rounded-md font-semibold text-white ${
          canPerformAction ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Conciliar Manualmente
      </button>

      <input
        type="text"
        placeholder="Justificativa para divergência (opcional)"
        value={justification}
        onChange={(e) => setJustification(e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={() => onReportDivergence(justification)}
        disabled={!canPerformAction}
        className={`px-4 py-2 rounded-md font-semibold text-white ${
          canPerformAction ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Reportar Divergência
      </button>

      {/* Outras ações rápidas como "Ignorar", "Estornar" podem ser adicionadas aqui */}
    </div>
  );
};

export default ReconciliationActions;
