import React from 'react';

const SettingsView: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Configurações</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Configurações do Usuário</h2>
        <p className="text-gray-600">
          Esta é a página de configurações. Funcionalidades como alteração de senha, preferências de notificação
          e personalização da interface podem ser implementadas aqui.
        </p>

        <div className="mt-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Salvar Alterações
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Configurações do Sistema (Admin)</h2>
        <p className="text-gray-600">
          Para administradores, esta seção pode incluir configurações globais do sistema,
          como gerenciamento de categorias, instituições bancárias e permissões.
        </p>
        <div className="mt-6">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                Gerenciar Categorias
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
