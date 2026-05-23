import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Users, Shield, Key, Activity } from 'lucide-react';
import api from '../lib/api';
import type { ApiResponse, DashboardStats } from '../lib/types';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = (await api.get<ApiResponse<DashboardStats>>('/v1/dashboard')) as unknown as ApiResponse<DashboardStats>;
        if (response && response.data) {
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

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? '0', icon: Users, color: 'var(--color-primary)' },
    { label: 'Active Roles', value: stats?.totalRoles ?? '0', icon: Shield, color: 'var(--color-secondary)' },
    { label: 'M2M Apps', value: stats?.totalApplications ?? '0', icon: Key, color: 'var(--color-accent)' },
    { label: 'System Health', value: stats?.systemHealth ?? 'Checking...', icon: Activity, color: stats?.systemHealth === 'Optimal' ? '#4ade80' : '#f87171' },
  ];

  return (
    <div className="dashboard-page animate-fade-in">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome, {user?.name}. Here's an overview of the system.</p>
      </header>

      <div className="stats-grid">
        {statCards.map((stat, i) => (
          <Card key={i} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              <stat.icon size={24} color="white" />
            </div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{loading ? '...' : stat.value}</span>
            </div>
          </Card>
        ))}
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
              <span className={`status-dot ${stats?.status.auth === 'ok' ? 'online' : 'offline'}`}></span>
            </li>
            <li>
              <span className="status-name">Database</span>
              <span className={`status-dot ${stats?.status.database === 'ok' ? 'online' : 'offline'}`}></span>
            </li>
            <li>
              <span className="status-name">Redis Cache</span>
              <span className={`status-dot ${stats?.status.redis === 'ok' ? 'online' : 'offline'}`}></span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
