import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { User, Shield, CheckCircle } from 'lucide-react';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="profile-page animate-fade-in">
      <header className="page-header">
        <h1>User Profile</h1>
        <p>Manage your account details and view your active permissions.</p>
      </header>

      <div className="profile-grid">
        <Card title="Account Information" subtitle="Your basic details" className="info-card">
          <div className="profile-details">
            <div className="detail-item">
              <User size={20} className="detail-icon" />
              <div>
                <span className="detail-label">Name</span>
                <span className="detail-value">{user.name || 'Not provided'}</span>
              </div>
            </div>
            <div className="detail-item">
              <CheckCircle size={20} className="detail-icon" />
              <div>
                <span className="detail-label">Email</span>
                <span className="detail-value">{user.email}</span>
              </div>
            </div>
            <div className="detail-item">
              <Shield size={20} className="detail-icon" />
              <div>
                <span className="detail-label">Account ID</span>
                <span className="detail-value text-muted">{user.userId}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Security & Access" subtitle="Your roles and permissions" className="access-card">
          <div className="access-section">
            <h3 className="section-title">Roles</h3>
            {user.roles && user.roles.length > 0 ? (
              <div className="badge-list">
                {user.roles.map((role) => (
                  <span key={role} className="badge role-badge">{role}</span>
                ))}
              </div>
            ) : (
              <p className="empty-text">No roles assigned.</p>
            )}
          </div>

          <div className="access-section">
            <h3 className="section-title">Permissions</h3>
            {user.perms && user.perms.length > 0 ? (
              <div className="badge-list">
                {user.perms.map((perm) => (
                  <span key={perm} className="badge perm-badge">{perm}</span>
                ))}
              </div>
            ) : (
              <p className="empty-text">No explicit permissions assigned.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
