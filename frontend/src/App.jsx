import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import DoctorsPage from './pages/DoctorsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import BillingPage from './pages/BillingPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Landing & Marketing */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/index.html" element={<Navigate to="/" replace />} />

            {/* Authentication */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login.html" element={<Navigate to="/login" replace />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register.html" element={<Navigate to="/register" replace />} />

            {/* Application Portal */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard.html" element={<Navigate to="/dashboard" replace />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients.html" element={<Navigate to="/patients" replace />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors.html" element={<Navigate to="/doctors" replace />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/appointments.html" element={<Navigate to="/appointments" replace />} />
            <Route path="/prescriptions" element={<PrescriptionsPage />} />
            <Route path="/prescriptions.html" element={<Navigate to="/prescriptions" replace />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/billing.html" element={<Navigate to="/billing" replace />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
