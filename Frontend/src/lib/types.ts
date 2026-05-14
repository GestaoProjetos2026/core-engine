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
  email: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}
