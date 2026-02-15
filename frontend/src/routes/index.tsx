import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import DashboardLayout from '../layout/DashboardLayout';
import LoginView from '../views/LoginView';
import Dashboard from '../views/Dashboard';
import ReconciliationView from '../views/ReconciliationView';
import ReconciliationPanel from '../components/reconciliation/ReconciliationPanel';
import ImportView from '../views/ImportView';
import ReportsView from '../views/ReportsView';
import AuditView from '../views/AuditView';
import SettingsView from '../views/SettingsView';
import { ROUTES } from '../constants/routes.constants';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';
import { PERMISSIONS } from '../constants/permissions.constants';
import DCBReport from '../components/reports/DCBReport';
import { ReconciliationReport } from '../types';

// Placeholder for a full report object - This should come from an API
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


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LOGIN} element={<LoginView />} />

      {/* Authenticated Routes with Dashboard Layout */}
      <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} /> {/* Default route for / */}
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.RECONCILIATION_LIST} element={<ReconciliationView />} />
        <Route path={ROUTES.RECONCILIATION_DETAIL} element={<ReconciliationPanel />} />
        <Route path={ROUTES.IMPORT_FILES} element={<RoleRoute requiredPermission={PERMISSIONS.UPLOAD_STATEMENT}><ImportView /></RoleRoute>} />
        <Route path={ROUTES.REPORTS} element={<RoleRoute requiredPermission={PERMISSIONS.GENERATE_REPORTS}><ReportsView /></RoleRoute>} />
        <Route path={`${ROUTES.REPORTS}/dcb`} element={<RoleRoute requiredPermission={PERMISSIONS.GENERATE_REPORTS}><DCBReport report={sampleReport}/></RoleRoute>} />
        <Route path={ROUTES.AUDIT_TRAIL} element={<RoleRoute requiredPermission={PERMISSIONS.VIEW_AUDIT_LOGS}><AuditView /></RoleRoute>} />
        <Route path={ROUTES.SETTINGS} element={<SettingsView />} />
      </Route>

      {/* Catch-all for 404 - You might want a dedicated 404 component */}
      <Route path="*" element={<div>404 - Página Não Encontrada</div>} />
    </Routes>
  );
};

export default AppRoutes;
