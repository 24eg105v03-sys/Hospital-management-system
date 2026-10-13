import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fillDemoCredentials = (u, p) => {
    setUsername(u);
    setPassword(p);
    showToast(`Loaded ${u} credentials!`, 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showToast('Please enter username and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await login(username.trim(), password.trim());
      if (res.success) {
        if (res.offline) {
          showToast('Running in local mode. Logging in...', 'success');
        } else {
          showToast('Login successful! Redirecting...', 'success');
        }
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      } else {
        showToast(res.error || 'Invalid credentials', 'error');
      }
    } catch (err) {
      showToast('Login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="brand-logo" style={{ justifyContent: 'center' }}>
            <div className="brand-icon">
              <i className="fa-solid fa-hospital"></i>
            </div>
            CarePulse HMS
          </Link>
          <h2>Welcome Back</h2>
          <p>Sign in to access your hospital portal</p>
        </div>

        {/* Quick Demo Login Helpers */}
        <div className="demo-credentials-box">
          <div className="demo-title">
            <i className="fa-solid fa-bolt"></i> Quick Demo Accounts:
          </div>
          <div className="credential-chips">
            <button
              type="button"
              className="chip-btn"
              onClick={() => fillDemoCredentials('admin', 'admin123')}
            >
              Admin
            </button>
            <button
              type="button"
              className="chip-btn"
              onClick={() => fillDemoCredentials('dr_sarah', 'doctor123')}
            >
              Doctor
            </button>
            <button
              type="button"
              className="chip-btn"
              onClick={() => fillDemoCredentials('john_doe', 'patient123')}
            >
              Patient
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} id="loginForm">
          <div className="form-group">
            <label htmlFor="username">
              <i className="fa-regular fa-user"></i> Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fa-solid fa-lock"></i> Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                <i className="fa-solid fa-arrow-right-to-bracket"></i> Sign In to Account
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
            &larr; Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
