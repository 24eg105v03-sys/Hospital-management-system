import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section */}
      <header className="hero-section">
        <div>
          <div className="hero-tag">
            <i className="fa-solid fa-shield-halved"></i> Enterprise Healthcare Platform
          </div>
          <h1 className="hero-title">
            Streamlined Care for <span>Patients & Doctors</span>
          </h1>
          <p className="hero-subtitle">
            An end-to-end full stack hospital management system built with Spring Boot, JPA, Spring Security, JWT, and modern responsive web technologies.
          </p>
          <div className="hero-buttons">
            <Link to="/dashboard" className="btn btn-primary">
              <i className="fa-solid fa-gauge-high"></i> Open Dashboard
            </Link>
            <Link to="/login" className="btn btn-secondary">
              <i className="fa-solid fa-arrow-right-to-bracket"></i> Staff Login
            </Link>
          </div>
        </div>

        <div className="hero-visual" id="stats">
          <div className="quick-stats-grid">
            <div className="stat-box">
              <div className="stat-icon stat-blue">
                <i className="fa-solid fa-user-injured"></i>
              </div>
              <div className="stat-info">
                <h3>1,500+</h3>
                <p>Active Patients</p>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon stat-teal">
                <i className="fa-solid fa-user-doctor"></i>
              </div>
              <div className="stat-info">
                <h3>80+</h3>
                <p>Specialist Doctors</p>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon stat-emerald">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <div className="stat-info">
                <h3>98.5%</h3>
                <p>On-Time Visits</p>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon stat-indigo">
                <i className="fa-solid fa-building-columns"></i>
              </div>
              <div className="stat-info">
                <h3>14</h3>
                <p>Departments</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2>Integrated Hospital Management Modules</h2>
          <p>Everything your clinic or hospital needs to deliver exceptional healthcare operations seamlessly.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <i className="fa-solid fa-hospital-user"></i>
            </div>
            <h4>Patient Records</h4>
            <p>Complete digital medical history, blood grouping, contact information, and timeline tracking in real time.</p>
            <Link to="/patients" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
              View Patients &rarr;
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <i className="fa-solid fa-user-doctor"></i>
            </div>
            <h4>Doctor Roster</h4>
            <p>Manage medical specialists, departments, consultation fees, credentials, and schedule availability.</p>
            <Link to="/doctors" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
              View Doctors &rarr;
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <i className="fa-solid fa-calendar-days"></i>
            </div>
            <h4>Appointment Booking</h4>
            <p>Intuitive appointment scheduler with status workflow (Pending, Confirmed, Completed, Cancelled).</p>
            <Link to="/appointments" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
              Appointments &rarr;
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <i className="fa-solid fa-prescription-bottle-medical"></i>
            </div>
            <h4>e-Prescriptions</h4>
            <p>Generate digital prescriptions with accurate dosages, medicines, diagnosis, and patient instructions.</p>
            <Link to="/prescriptions" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
              Prescriptions &rarr;
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <i className="fa-solid fa-file-invoice-dollar"></i>
            </div>
            <h4>Billing & Invoicing</h4>
            <p>Instant invoice generation, discounts, payment status tracking, and revenue calculation across departments.</p>
            <Link to="/billing" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
              Billing &rarr;
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <i className="fa-solid fa-lock"></i>
            </div>
            <h4>Secure Auth & JWT</h4>
            <p>Role-based access control (Admin, Doctor, Patient, Staff) with stateless Spring Security and JWT tokens.</p>
            <Link to="/login" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
              Login Portal &rarr;
            </Link>
          </div>
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '3rem 1rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 'auto' }}>
        CarePulse Hospital Management System &copy; 2026. Full Stack Enterprise Solution.
      </footer>
    </div>
  );
}
