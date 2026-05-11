import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Plus, Settings } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: { code: string }[];
}

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    try {
      const response: any = await api.get('/v1/roles');
      setRoles(response.data.data);
    } catch (error) {
      console.error('Failed to fetch roles', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="roles-page animate-fade-in">
      <header className="page-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Roles & Permissions</h1>
          <p>Define roles and assign fine-grained permissions.</p>
        </div>
        <Button variant="secondary">
          <Plus size={20} />
          Create Role
        </Button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {loading ? (
          <div style={{ color: 'var(--color-text-muted)' }}>Loading roles...</div>
        ) : (
          roles.map((role) => (
            <Card key={role.id} title={role.name} subtitle={role.description}>
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                  Permissions ({role.permissions.length})
                </h4>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {role.permissions.map(p => (
                    <Badge key={p.code} variant="info">{p.code}</Badge>
                  ))}
                  {role.permissions.length === 0 && <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>No permissions assigned</span>}
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Settings size={16} />
                Manage Role
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RolesPage;
