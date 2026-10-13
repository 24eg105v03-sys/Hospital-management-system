import React from 'react';
import { Link } from 'react-router-dom';

export default function AppHeader({ searchContent, actionContent, onToggleSidebar }) {
  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.45rem 0.65rem' }}
            title="Toggle Menu"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        )}
        {searchContent ? (
          searchContent
        ) : (
          <div className="header-search">
            <i className="fa-solid fa-magnifying-glass" style={{ color: '#94a3b8' }}></i>
            <input type="text" placeholder="Search patients, doctors, records..." />
          </div>
        )}
      </div>

      <div className="header-actions">
        {actionContent ? (
          actionContent
        ) : (
          <>
            <Link to="/appointments" className="btn btn-primary btn-sm">
              <i className="fa-solid fa-plus"></i> New Appointment
            </Link>
            <Link to="/" className="btn btn-secondary btn-sm" title="Home">
              <i className="fa-solid fa-house"></i>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
