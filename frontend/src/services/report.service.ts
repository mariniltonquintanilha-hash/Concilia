import { api } from './api';
import { ReconciliationReport } from '../types';

export class ReportService {
  async getDcbReport(reconciliationId: string): Promise<ReconciliationReport> {
    const response = await api.get(`/reports/dcb/${reconciliationId}`);
    return response.data;
  }

  async getVarianceAnalysis(bankAccountId: string, periodEnd: string): Promise<any> {
    const response = await api.get(`/reports/variance-analysis/${bankAccountId}/${periodEnd}`);
    return response.data;
  }
}
