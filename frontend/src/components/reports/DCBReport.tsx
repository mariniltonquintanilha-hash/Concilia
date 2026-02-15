import React, { useState } from 'react';
import { ReconciliationReport } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { exportToPDF } from '../../utils/export';

interface DCBReportProps {
  report: ReconciliationReport;
}

const DCBReport: React.FC<DCBReportProps> = ({ report }) => {
  const [includeDetails, setIncludeDetails] = useState(true);

  const calculateAdjustedBalance = () => {
    const unmatchedDebits = report.unmatchedItems
      .filter(item => item.operationType === 'DEBIT')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const unmatchedCredits = report.unmatchedItems
      .filter(item => item.operationType === 'CREDIT')
      .reduce((sum, item) => sum + item.amount, 0);

    return report.openingBalance + unmatchedCredits - unmatchedDebits;
  };

  const handleExport = () => {
    const content = generateReportContent();
    exportToPDF(content, `DCB-${report.period}-${new Date().toISOString().split('T')[0]}`);
  };

  const generateReportContent = () => {
    return `
      <h1>Demonstrativo de Conciliação Bancária</h1>
      <h2>Período: ${report.period}</h2>
      <h3>Conta: ${report.accountNumber}</h3>
      
      <table>
        <tr>
          <td>Saldo Inicial</td>
          <td>${formatCurrency(report.openingBalance)}</td>
        </tr>
        <tr>
          <td>Total Débitos não conciliados</td>
          <td>${formatCurrency(report.unmatchedDebits)}</td>
        </tr>
        <tr>
          <td>Total Créditos não conciliados</td>
          <td>${formatCurrency(report.unmatchedCredits)}</td>
        </tr>
        <tr>
          <td><strong>Saldo Ajustado</strong></td>
          <td><strong>${formatCurrency(calculateAdjustedBalance())}</strong></td>
        </tr>
      </table>
      
      ${includeDetails ? `
        <h3>Detalhes das Divergências:</h3>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Justificativa</th>
            </tr>
          </thead>
          <tbody>
            ${report.unmatchedItems.map(item => `
              <tr>
                <td>${item.transactionDate}</td>
                <td>${item.description}</td>
                <td>${formatCurrency(item.amount)}</td>
                <td>${item.operationType}</td>
                <td>${item.justification || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}
    `;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Demonstrativo de Conciliação Bancária
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Período</p>
            <p className="font-semibold">{report.period}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Conta Bancária</p>
            <p className="font-semibold">{report.accountNumber}</p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Valor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4">Saldo Inicial</td>
              <td className="px-6 py-4 font-medium">
                {formatCurrency(report.openingBalance)}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4">(+) Créditos não conciliados</td>
              <td className="px-6 py-4 text-green-600">
                +{formatCurrency(report.unmatchedCredits)}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4">(-) Débitos não conciliados</td>
              <td className="px-6 py-4 text-red-600">
                -{formatCurrency(report.unmatchedDebits)}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-6 py-4 font-bold">Saldo Ajustado</td>
              <td className="px-6 py-4 font-bold">
                {formatCurrency(calculateAdjustedBalance())}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {includeDetails && report.unmatchedItems.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Divergências Detalhadas</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Data</th>
                  <th className="px-4 py-2">Descrição</th>
                  <th className="px-4 py-2">Valor</th>
                  <th className="px-4 py-2">Tipo</th>
                  <th className="px-4 py-2">Justificativa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {report.unmatchedItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{item.transactionDate.toDateString()}</td>
                    <td className="px-4 py-2">{item.description}</td>
                    <td className={`px-4 py-2 ${
                      item.operationType === 'CREDIT' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {item.operationType === 'CREDIT' ? '+' : '-'}
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        item.operationType === 'CREDIT'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.operationType}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {item.justification || (
                        <span className="text-yellow-600 text-sm">Pendente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DCBReport;
