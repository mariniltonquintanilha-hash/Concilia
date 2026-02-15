import { create } from 'zustand';
import { ImportedFile } from '../types';

interface ImportState {
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  lastImportedFile: ImportedFile | null;
  startUpload: () => void;
  updateProgress: (progress: number) => void;
  uploadSuccess: (file: ImportedFile) => void;
  uploadError: (message: string) => void;
  resetImportState: () => void;
}

export const useImportStore = create<ImportState>((set) => ({
  isUploading: false,
  uploadProgress: 0,
  error: null,
  lastImportedFile: null,
  startUpload: () => set({ isUploading: true, uploadProgress: 0, error: null }),
  updateProgress: (progress) => set({ uploadProgress: progress }),
  uploadSuccess: (file) =>
    set({ isUploading: false, uploadProgress: 100, lastImportedFile: file }),
  uploadError: (message) =>
    set({ isUploading: false, error: message, uploadProgress: 0 }),
  resetImportState: () =>
    set({
      isUploading: false,
      uploadProgress: 0,
      error: null,
      lastImportedFile: null,
    }),
}));
