import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { authState } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <p className="text-gray-700">Bem-vindo(a), {authState.user?.fullName || 'Usuário'}!</p>
      <p className="text-gray-600">Seu papel: {authState.user?.role || 'Não Definido'}</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Conciliações Recentes</h2>
          <p className="text-gray-600">Nenhuma conciliação recente para exibir.</p>
          {/* Placeholder for recent reconciliation data */}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Status de Importação</h2>
          <p className="text-gray-600">Nenhum arquivo importado recentemente.</p>
          {/* Placeholder for import status */}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Alertas</h2>
          <ul className="text-red-600">
            <li>Nenhuma divergência crítica.</li>
            {/* Placeholder for critical alerts */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
