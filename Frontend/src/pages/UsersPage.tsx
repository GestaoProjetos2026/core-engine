import React, { useEffect, useState, useCallback } from 'react';
import api from '../lib/api';
import { AxiosResponse } from 'axios';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Plus, UserCog, Power } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  roles: { name: string }[];
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get<{ data: User[] }>('/v1/users') as AxiosResponse<{ data: User[] }>;
      setUsers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const toggleStatus = async (user: User) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.patch(`/v1/users/${user.id}/status`, { status: newStatus });
      fetchUsers();
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="users-page animate-fade-in">
      <header className="page-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>User Management</h1>
          <p>Create and manage user accounts and access levels.</p>
        </div>
        <Button>
          <Plus size={20} />
          New User
        </Button>
      </header>

      <Card>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading users...</div>
        ) : (
          <Table headers={['Name', 'Email', 'Roles', 'Status', 'Actions']}>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {user.roles.map(r => (
                      <Badge key={r.name}>{r.name}</Badge>
                    ))}
                    {user.roles.length === 0 && <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>No roles</span>}
                  </div>
                </td>
                <td>
                  <Badge variant={user.status === 'ACTIVE' ? 'success' : 'error'}>
                    {user.status}
                  </Badge>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="ghost" size="sm">
                      <UserCog size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleStatus(user)}
                    >
                      <Power size={16} color={user.status === 'ACTIVE' ? '#f87171' : '#4ade80'} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};

export default UsersPage;
