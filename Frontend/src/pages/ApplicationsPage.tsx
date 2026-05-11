import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Plus, RefreshCw, Eye } from 'lucide-react';

interface Application {
  id: string;
  name: string;
  clientId: string;
  status: 'ACTIVE' | 'INACTIVE';
  scopes: { code: string }[];
}

const ApplicationsPage: React.FC = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const response: any = await api.get('/v1/applications');
      setApps(response.data.data);
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <div className="applications-page animate-fade-in">
      <header className="page-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>M2M Applications</h1>
          <p>Manage machine-to-machine integration clients.</p>
        </div>
        <Button variant="outline">
          <Plus size={20} />
          Register App
        </Button>
      </header>

      <Card>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading applications...</div>
        ) : (
          <Table headers={['Application Name', 'Client ID', 'Scopes', 'Status', 'Actions']}>
            {apps.map((app) => (
              <tr key={app.id}>
                <td style={{ fontWeight: 600 }}>{app.name}</td>
                <td>
                  <code style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                    {app.clientId}
                  </code>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {app.scopes.map(s => (
                      <Badge key={s.code} variant="warning">{s.code}</Badge>
                    ))}
                  </div>
                </td>
                <td>
                  <Badge variant={app.status === 'ACTIVE' ? 'success' : 'error'}>
                    {app.status}
                  </Badge>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="ghost" size="sm" title="View Details">
                      <Eye size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" title="Rotate Secret">
                      <RefreshCw size={16} />
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

export default ApplicationsPage;
