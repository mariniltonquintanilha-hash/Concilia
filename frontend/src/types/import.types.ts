// Defines types related to file import processes
export interface ImportedFile {
  id: string;
  fileName: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  importedAt: Date;
  // Add more fields as needed
}
