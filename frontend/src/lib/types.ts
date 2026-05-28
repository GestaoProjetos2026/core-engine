export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  path: string;
  meta?: {
    requestId: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface User {
  userId: string;
  email: string;
  name?: string;
  roles: string[];
  perms: string[];
}

/** Item retornado por `GET /v1/users` e rotas de usuário administrativo (RF09). */
export interface AdminUserListItem {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  roles?: { roleId: string }[];
}

export interface Permission {
  id: string;
  code: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  permissions?: { permission: Permission }[];
  _count?: {
    users: number;
    permissions: number;
  };
}

export interface CreateRoleDto {
  name: string;
  description?: string;
}

export interface CreatePermissionDto {
  code: string;
  description: string;
}

/** Item retornado por `GET /v1/applications` (sem secret — RN02). */
export interface ApplicationListItem {
  id: string;
  name: string;
  clientId: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

/** Resposta de `POST /v1/applications` ou `POST .../regenerate-secret` (secret exibido uma vez). */
export interface ApplicationWithSecret extends ApplicationListItem {
  clientSecret: string;
}

/** Escopo M2M (`GET /v1/scopes`, `GET /v1/applications/:id/scopes`). */
export interface Scope {
  id: string;
  code: string;
  description?: string | null;
}
/** Estatísticas do Dashboard (`GET /v1/dashboard/stats`). */
export interface DashboardStats {
  totalUsers: number;
  totalRoles: number;
  totalApplications: number;
  systemHealth: 'Optimal' | 'Degraded';
  status: {
    database: 'ok' | 'degraded';
    redis: 'ok' | 'degraded';
    auth: 'ok' | 'degraded';
  };
}
