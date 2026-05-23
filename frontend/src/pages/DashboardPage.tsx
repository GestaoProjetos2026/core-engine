import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Users, Shield, Key, Activity } from 'lucide-react';
import api from '../lib/api';
import type { ApiResponse, DashboardStats } from '../lib/types';
import './DashboardPage.css';

type MetricTone = 'brand' | 'info' | 'success' | 'danger';

interface MetricCardConfig {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number }>;
  tone: MetricTone;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = (await api.get<ApiResponse<DashboardStats>>('/v1/dashboard')) as unknown as ApiResponse<DashboardStats>;
        if (response?.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('DASHBOARD DEBUG ERROR:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const healthTone: MetricTone = stats?.systemHealth === 'Optimal' ? 'success' : 'danger';

  const statCards: MetricCardConfig[] = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, tone: 'brand' },
    { label: 'Active Roles', value: stats?.totalRoles ?? 0, icon: Shield, tone: 'brand' },
    { label: 'M2M Apps', value: stats?.totalApplications ?? 0, icon: Key, tone: 'info' },
    { label: 'System Health', value: stats?.systemHealth ?? 'Checking...', icon: Activity, tone: healthTone },
  ];

  return (
    <div className="dashboard-page animate-fade-in">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome, {user?.name}. Here&apos;s an overview of the system.</p>
      </header>

      <div className="stats-grid">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className={`metric-card metric-card--${stat.tone}`}>
              <div className="metric-card__icon">
                <Icon size={24} />
              </div>
              <div className="metric-card__body">
                <span className="metric-label">{stat.label}</span>
                <span className="metric-value">{loading ? '…' : stat.value}</span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <Card title="Recent Activity" subtitle="Latest system events" className="activity-card">
          <div className="empty-state">
            <p>No recent activity logs found.</p>
          </div>
        </Card>

        <Card title="System Status" subtitle="Integration endpoints" className="status-card">
          <ul className="status-list">
            <li>
              <span className="status-name">Auth Service</span>
              <span className={`status-dot ${stats?.status?.auth === 'ok' ? 'online' : 'offline'}`} />
            </li>
            <li>
              <span className="status-name">Database</span>
              <span className={`status-dot ${stats?.status?.database === 'ok' ? 'online' : 'offline'}`} />
            </li>
            <li>
              <span className="status-name">Redis Cache</span>
              <span className={`status-dot ${stats?.status?.redis === 'ok' ? 'online' : 'offline'}`} />
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
