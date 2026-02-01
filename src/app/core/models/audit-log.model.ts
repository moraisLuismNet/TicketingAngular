export interface AuditLog {
  id: number;
  entityName: string;
  action: string;
  recordId: number;
  oldValues: string;
  newValues: string;
  userId: number;
  userName: string;
  createdAt: string;
}
