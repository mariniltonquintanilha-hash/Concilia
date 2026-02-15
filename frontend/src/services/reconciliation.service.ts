import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001/api/v1';

export class ReconciliationService {
  private api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${YOUR_AUTH_TOKEN}`, // Add authentication if needed
    },
  });

  async getReconciliationData(reconciliationId: string): Promise<any> {
    // This is a placeholder. In a real application, this would fetch data from the backend.
    console.log(`Fetching reconciliation data for ${reconciliationId}`);
    return {
        statementItems: [], // Replace with actual data from API
        accountingEntries: [] // Replace with actual data from API
    };
  }

  async manualMatch(
    reconciliationId: string,
    statementItemId: string,
    accountingEntryId: string
  ): Promise<any> {
    const response = await this.api.post(`/reconciliations/${reconciliationId}/manual-reconcile`, {
      statementItemId,
      accountingEntryId,
    });
    return response.data;
  }

  async reportDivergence(
    reconciliationId: string,
    statementItemId: string,
    accountingEntryId: string,
    justification: string
  ): Promise<any> {
    const response = await this.api.post(`/reconciliations/${reconciliationId}/report-divergence`, {
      statementItemId,
      accountingEntryId,
      divergenceType: 'Manual Report', // Example
      divergenceAmount: 0, // Example
      justification,
    });
    return response.data;
  }
}
