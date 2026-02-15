import { useState, useCallback } from 'react';
import { ImportService } from '../services/import.service';
import { ImportedFile } from '../types';

export const useImport = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [importedFile, setImportedFile] = useState<ImportedFile | null>(null);

  const importService = new ImportService();

  const uploadFile = useCallback(async (file: File, bankAccountId: string) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    try {
      // In a real implementation, you might track progress more granularly
      // For now, it's a simple async call
      const result = await importService.uploadFile(file, bankAccountId);
      setImportedFile(result);
      setUploadProgress(100); // Assume 100% on success
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { isUploading, uploadProgress, error, importedFile, uploadFile };
};
