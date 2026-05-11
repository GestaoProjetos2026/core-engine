import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  ExternalLink, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import './Layout.css';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'Users', path: '/users' },
    { icon: <ShieldCheck size={20} />, label: 'Roles & Perms', path: '/roles' },
    { icon: <ExternalLink size={20} />, label: 'Applications', path: '/applications' },
  ];

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <ShieldCheck size={28} color="var(--color-highlight)" />
            <span>ERP Core</span>
          </div>
          <button className="mobile-close" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-wrapper">
        <header className="header">
          <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          
          <div className="header-user">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-email">{user?.email}</span>
            </div>
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </main>

      {isMobileMenuOpen && (
        <div className="overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </div>
  );
};

export default Layout;
