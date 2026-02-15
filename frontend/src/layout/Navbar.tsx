import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes.constants';

const Navbar: React.FC = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-xl font-semibold text-gray-800">
        Bem-vindo, {authState.user?.fullName || 'Usuário'}!
      </div>
      <nav>
        <ul className="flex items-center space-x-4">
          <li>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
