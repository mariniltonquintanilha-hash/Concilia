import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReconciliationPanel from './components/reconciliation/ReconciliationPanel';
import DCBReport from './components/reports/DCBReport';
import { ReconciliationReport } from './types/reconciliation.types';

// Placeholder for a full report object
const sampleReport: ReconciliationReport = {
  period: 'Jan-2024',
  accountNumber: '12345-6',
  openingBalance: 10000.00,
  closingBalance: 12000.00,
  unmatchedDebits: 500.00,
  unmatchedCredits: 2500.00,
  unmatchedItems: [
    {
      id: 'div1',
      transactionDate: new Date('2024-01-15'),
      description: 'Rent Payment',
      amount: 1500.00,
      operationType: 'DEBIT',
      justification: 'Cheque not cleared yet',
      matchStatus: 'DIVERGENCE',
    },
    {
      id: 'div2',
      transactionDate: new Date('2024-01-20'),
      description: 'Consulting Fee',
      amount: 2000.00,
      operationType: 'CREDIT',
      matchStatus: 'PENDING',
    },
  ],
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1 className="text-3xl font-bold underline">Welcome to Bank Reconciliation</h1>} />
        <Route path="/reconciliation/:reconciliationId" element={<ReconciliationPanel />} />
        <Route path="/reports/dcb" element={<DCBReport report={sampleReport} />} />
        {/* Add more routes here */}
      </Routes>
    </Router>
  );
}

export default App;
