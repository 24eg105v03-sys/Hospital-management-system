import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        role
      });

      if (res.success) {
        showToast('Account registered successfully! Redirecting to login...', 'success');
        setTimeout(() => {
          navigate('/login');
        }, 1200);
      } else {
        showToast(res.error || 'Registration failed', 'error');
      }
    } catch (err) {
      showToast('Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <Link to="/" className="brand-logo" style={{ justifyContent: 'center' }}>
            <div className="brand-icon">
              <i className="fa-solid fa-hospital"></i>
            </div>
            CarePulse HMS
          </Link>
          <h2>Create an Account</h2>
          <p>Join the healthcare management portal</p>
        </div>

        <form onSubmit={handleSubmit} id="registerForm">
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="reg_fullname">Full Name</label>
              <input
                type="text"
                id="reg_fullname"
                className="form-control"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg_username">Username</label>
              <input
                type="text"
                id="reg_username"
                className="form-control"
                placeholder="janedoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg_email">Email Address</label>
            <input
              type="email"
              id="reg_email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="reg_password">Password</label>
              <input
                type="password"
                id="reg_password"
                className="form-control"
                placeholder="At least 6 chars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg_role">Account Role</label>
              <select
                id="reg_role"
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
                <option value="RECEPTIONIST">Staff / Receptionist</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              'Registering...'
            ) : (
              <>
                <i className="fa-solid fa-user-plus"></i> Complete Registration
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign In
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
