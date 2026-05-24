import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import './components/ui/Toast.css';
import { PrivateRoute } from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import ApplicationsPage from './pages/ApplicationsPage';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
