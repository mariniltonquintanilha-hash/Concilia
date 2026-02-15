import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../constants/routes.constants';
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../constants/permissions.constants';

const Sidebar: React.FC = () => {
  const { hasPermission } = usePermissions();

  const navItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: '📊', permission: PERMISSIONS.VIEW_DASHBOARD },
    { name: 'Conciliações', path: ROUTES.RECONCILIATION_LIST, icon: '🗂️', permission: PERMISSIONS.VIEW_RECONCILIATION },
    { name: 'Importar Arquivos', path: ROUTES.IMPORT_FILES, icon: '📥', permission: PERMISSIONS.UPLOAD_STATEMENT },
    { name: 'Relatórios', path: ROUTES.REPORTS, icon: '📈', permission: PERMISSIONS.GENERATE_REPORTS },
    { name: 'Trilha de Auditoria', path: ROUTES.AUDIT_TRAIL, icon: '🔍', permission: PERMISSIONS.VIEW_AUDIT_LOGS },
    { name: 'Gerenciar Usuários', path: ROUTES.USER_MANAGEMENT, icon: '👥', permission: PERMISSIONS.MANAGE_USERS },
    { name: 'Configurações', path: ROUTES.SETTINGS, icon: '⚙️', permission: null },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <div className="text-2xl font-bold mb-8">BR System</div>
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            // Only render if the user has permission or if permission is not required
            (item.permission === null || hasPermission(item.permission)) && (
              <li key={item.name} className="mb-2">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-md transition-colors ${
                      isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            )
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-700 text-sm text-gray-400">
        © 2024 BR System
      </div>
    </div>
  );
};

export default Sidebar;
