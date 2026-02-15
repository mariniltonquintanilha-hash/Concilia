import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes.constants';

const ReconciliationView: React.FC = () => {
  // Mock data for reconciliations
  const reconciliations = [
    { id: 'rec-001', period: 'Jan 2024', bankAccount: 'Conta Corrente A', status: 'OPEN' },
    { id: 'rec-002', period: 'Dec 2023', bankAccount: 'Conta Poupança B', status: 'IN_REVIEW' },
    { id: 'rec-003', period: 'Nov 2023', bankAccount: 'Conta Corrente A', status: 'APPROVED' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Conciliações</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Lista de Conciliações</h2>
        <ul>
          {reconciliations.map((rec) => (
            <li key={rec.id} className="border-b last:border-b-0 py-3 flex justify-between items-center">
              <div>
                <Link to={ROUTES.RECONCILIATION_DETAIL.replace(':reconciliationId', rec.id)} className="text-blue-600 hover:underline text-lg font-medium">
                  Conciliação {rec.period} - {rec.bankAccount}
                </Link>
                <p className="text-sm text-gray-500">Status: {rec.status}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                rec.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' :
                rec.status === 'IN_REVIEW' ? 'bg-blue-100 text-blue-800' :
                rec.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {rec.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReconciliationView;
