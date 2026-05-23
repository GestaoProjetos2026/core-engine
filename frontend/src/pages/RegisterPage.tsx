import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';
import './LoginPage.css';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/v1/auth/register', { name, email, password });
      navigate('/login', { state: { message: 'Account created! Please login.' } });
    } catch (err: unknown) {
      const errorData = err as { error?: { message?: string } };
      const msg = errorData.error?.message || 'Registration failed. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container animate-fade-in">
        <div className="login-header">
          <div className="login-logo">
            <ShieldCheck size={48} className="login-logo-icon" aria-hidden />
          </div>
          <h1>Create Account</h1>
          <p>Join the ERP Core Auth System</p>
        </div>

        <Card className="login-card">
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="auth-alert auth-alert--error">{error}</div>}
            
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button 
              type="submit" 
              className="w-full" 
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>
        </Card>

        <p className="login-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
