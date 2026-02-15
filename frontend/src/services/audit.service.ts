import { api } from './api';
import { AuditLog } from '../types';

export class AuditService {
  async getAuditTrail(): Promise<AuditLog[]> {
    const response = await api.get('/audit/trail');
    return response.data;
  }

  async getAccessLogs(): Promise<AuditLog[]> {
    const response = await api.get('/audit/access-logs');
    return response.data;
  }

  async logClientAction(action: string, details: any): Promise<void> {
    // This could be used to log client-side actions to the backend audit trail
    // Not explicitly in backend, but a good practice
    console.log('Logging client action to backend:', action, details);
    // await api.post('/audit/client-action', { action, details });
  }
}
