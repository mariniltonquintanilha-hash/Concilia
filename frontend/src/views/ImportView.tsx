import React, { useState } from 'react';
import { useImport } from '../hooks/useImport';

const ImportView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bankAccountId, setBankAccountId] = useState('mock-bank-account-id'); // Placeholder
  const { isUploading, uploadProgress, error, importedFile, uploadFile } = useImport();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile && bankAccountId) {
      await uploadFile(selectedFile, bankAccountId);
    } else {
      alert('Selecione um arquivo e forneça o ID da conta bancária.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Importar Arquivos de Extrato</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bankAccountId" className="block text-sm font-medium text-gray-700">
              ID da Conta Bancária (Placeholder)
            </label>
            <input
              type="text"
              id="bankAccountId"
              value={bankAccountId}
              onChange={(e) => setBankAccountId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="file-upload" className="sr-only">
              Escolher arquivo
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          <button
            type="submit"
            disabled={isUploading || !selectedFile || !bankAccountId}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isUploading ? `Enviando (${uploadProgress}%)` : 'Enviar Arquivo'}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-600">Erro no upload: {error}</p>
        )}

        {importedFile && (
          <div className="mt-4 p-4 border rounded-md bg-green-50 text-green-800">
            <p>Arquivo importado com sucesso: <strong>{importedFile.fileName}</strong></p>
            <p>Status: {importedFile.status}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportView;
