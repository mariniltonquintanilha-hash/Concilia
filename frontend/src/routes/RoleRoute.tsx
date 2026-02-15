import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface RoleRouteProps {
  children: React.ReactNode;
  requiredPermission: string;
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, requiredPermission }) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700">
        <p className="text-xl">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleRoute;
