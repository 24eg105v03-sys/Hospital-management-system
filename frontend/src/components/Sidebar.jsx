import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const displayName = user?.fullName || user?.username || 'Administrator';
  const displayRole = user?.role || 'SUPER ADMIN';
  const avatarLetter = (displayName.charAt(0) || 'A').toUpperCase();

  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="brand-icon">
            <i className="fa-solid fa-hospital"></i>
          </div>
          <h2>CarePulse</h2>
        </div>
        {isOpen && (
          <button
            onClick={onClose}
            className="btn btn-sm btn-secondary"
            style={{ padding: '0.2rem 0.5rem', display: 'none' }}
          >
            &times;
          </button>
        )}
      </div>

      <div className="sidebar-nav">
        <div className="nav-category">Main Menu</div>
        <NavLink
          to="/dashboard"
          onClick={onClose}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon"><i className="fa-solid fa-chart-pie"></i></span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/patients"
          onClick={onClose}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon"><i className="fa-solid fa-hospital-user"></i></span>
          <span>Patients</span>
        </NavLink>

        <NavLink
          to="/doctors"
          onClick={onClose}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon"><i className="fa-solid fa-user-doctor"></i></span>
          <span>Doctors</span>
        </NavLink>

        <NavLink
          to="/appointments"
          onClick={onClose}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon"><i className="fa-solid fa-calendar-check"></i></span>
          <span>Appointments</span>
        </NavLink>

        <div className="nav-category">Clinical & Finance</div>
        <NavLink
          to="/prescriptions"
          onClick={onClose}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon"><i className="fa-solid fa-file-prescription"></i></span>
          <span>Prescriptions</span>
        </NavLink>

        <NavLink
          to="/billing"
          onClick={onClose}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon"><i className="fa-solid fa-receipt"></i></span>
          <span>Billing & Invoices</span>
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="user-avatar" id="userAvatar">{avatarLetter}</div>
          <div className="user-details">
            <h5 id="userNameDisplay">{displayName}</h5>
            <p id="userRoleDisplay">{displayRole}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger btn-sm"
          title="Log Out"
          style={{ padding: '0.4rem 0.6rem' }}
        >
          <i className="fa-solid fa-arrow-right-to-bracket"></i>
        </button>
      </div>
    </aside>
  );
}
