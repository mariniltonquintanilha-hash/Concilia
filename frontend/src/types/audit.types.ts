// Defines types related to audit logs
export interface AuditLog {
  id: string;
  timestamp: Date;
  action: string;
  userId: string;
  userName: string;
  entityType: string;
  entityId: string;
  details: any;
}
