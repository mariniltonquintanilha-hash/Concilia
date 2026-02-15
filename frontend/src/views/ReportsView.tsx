import React from 'react';
import { Link } from 'react-router-dom';

const ReportsView: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Relatórios</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/reports/dcb" className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">Demonstrativo de Conciliação Bancária (DCB)</h2>
          <p className="text-gray-600">Visualize e exporte o demonstrativo detalhado de conciliação.</p>
        </Link>

        <div className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">Análise de Variações</h2>
          <p className="text-gray-600">Compare os resultados atuais com períodos anteriores para identificar tendências.</p>
          {/* Link to actual variance analysis report view */}
        </div>

        <div className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">Relatório de Divergências</h2>
          <p className="text-gray-600">Acompanhe todas as divergências e suas justificativas.</p>
          {/* Link to actual divergences report view */}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
