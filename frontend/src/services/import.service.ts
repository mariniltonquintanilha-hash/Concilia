import { api } from './api';
import { ImportedFile } from '../types';

export class ImportService {
  async uploadFile(file: File, bankAccountId: string): Promise<ImportedFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bankAccountId', bankAccountId); // Assuming the backend expects this

    const response = await api.post('/import/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getImportHistory(): Promise<ImportedFile[]> {
    const response = await api.get('/import/history');
    return response.data;
  }
}
