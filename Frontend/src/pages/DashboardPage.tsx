import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Users, Shield, Key, Activity } from 'lucide-react';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Users', value: '12', icon: Users, color: 'var(--color-primary)' },
    { label: 'Active Roles', value: '4', icon: Shield, color: 'var(--color-secondary)' },
    { label: 'M2M Apps', value: '3', icon: Key, color: 'var(--color-accent)' },
    { label: 'System Health', value: 'Optimal', icon: Activity, color: '#4ade80' },
  ];

  return (
    <div className="dashboard-page animate-fade-in">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome, {user?.name}. Here's an overview of the system.</p>
      </header>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <Card key={i} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              <stat.icon size={24} color="white" />
            </div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
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
              <span className="status-dot online"></span>
            </li>
            <li>
              <span className="status-name">Database</span>
              <span className="status-dot online"></span>
            </li>
            <li>
              <span className="status-name">Redis Cache</span>
              <span className="status-dot offline"></span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
