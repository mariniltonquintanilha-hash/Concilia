import { useAuth } from './useAuth';
import { useCallback } from 'react';

// Define roles and their permissions in a more robust way in a real application
// For now, simple logic based on user role
const rolePermissions: Record<string, string[]> = {
  ADMIN: ['*'], // Admin has all permissions
  MANAGER: ['VIEW_RECONCILIATION', 'APPROVE_RECONCILIATION', 'REPORT_DIVERGENCE'],
  ANALYST: ['VIEW_RECONCILIATION', 'MANUAL_RECONCILIATION', 'REPORT_DIVERGENCE', 'UPLOAD_STATEMENT'],
  AUDITOR: ['VIEW_RECONCILIATION', 'VIEW_AUDIT_LOGS'],
};

export const usePermissions = () => {
  const { authState } = useAuth();
  const userRole = authState.user?.role;

  const hasPermission = useCallback(
    (permissionCode: string) => {
      if (!userRole) {
        return false;
      }
      const permissions = rolePermissions[userRole] || [];
      return permissions.includes('*') || permissions.includes(permissionCode);
    },
    [userRole]
  );

  return { hasPermission, userRole };
};
