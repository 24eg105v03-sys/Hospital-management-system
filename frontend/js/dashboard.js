/**
 * Hospital Management System - Dashboard Controller (dashboard.js)
 */

const API_BASE = 'http://localhost:8080/api';

function getAuthHeaders() {
  const token = localStorage.getItem('hms_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

function checkAuth() {
  const user = JSON.parse(localStorage.getItem('hms_user') || 'null');
  const userDisplay = document.getElementById('userNameDisplay');
  
  const userRoleDisplay = document.getElementById('userRoleDisplay');
  const userAvatar = document.getElementById('userAvatar');

  if (user) {
    if (userDisplay) userDisplay.innerText = user.fullName || user.username;
    if (userRoleDisplay) userRoleDisplay.innerText = user.role || 'STAFF';
    if (userAvatar) userAvatar.innerText = (user.fullName || user.username).charAt(0).toUpperCase();
  }
}

function logout() {
  localStorage.removeItem('hms_token');
  localStorage.removeItem('hms_user');
  window.location.href = 'login.html';
}

async function loadDashboardMetrics() {
  try {
    const [patRes, docRes, aptRes, revRes] = await Promise.all([
      fetch(`${API_BASE}/patients/count`, { headers: getAuthHeaders() }),
      fetch(`${API_BASE}/doctors/count`, { headers: getAuthHeaders() }),
      fetch(`${API_BASE}/appointments/today`, { headers: getAuthHeaders() }),
      fetch(`${API_BASE}/billing/revenue`, { headers: getAuthHeaders() })
    ]);

    const patCount = patRes.ok ? await patRes.json() : 4;
    const docCount = docRes.ok ? await docRes.json() : 4;
    const todayApts = aptRes.ok ? await aptRes.json() : [];
    const revenue = revRes.ok ? await revRes.json() : { totalRevenue: 300.0 };

    document.getElementById('metricPatients').innerText = patCount;
    document.getElementById('metricDoctors').innerText = docCount;
    document.getElementById('metricAppointments').innerText = Array.isArray(todayApts) ? todayApts.length : 2;
    document.getElementById('metricRevenue').innerText = '₹' + (revenue.totalRevenue || 2700).toLocaleString('en-IN');
  } catch (e) {
    // Local / Offline fallback values
    document.getElementById('metricPatients').innerText = '4';
    document.getElementById('metricDoctors').innerText = '4';
    document.getElementById('metricAppointments').innerText = '2';
    document.getElementById('metricRevenue').innerText = '₹2,700.00';
  }
}

async function loadRecentAppointments() {
  const tbody = document.getElementById('recentAppointmentsBody');
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE}/appointments`, { headers: getAuthHeaders() });
    if (res.ok) {
      const appointments = await res.json();
      renderAppointmentsTable(appointments.slice(0, 5));
      return;
    }
  } catch (err) {
    console.warn('Using offline mock appointments', err);
  }

  // Fallback mock appointments
  const mock = [
    { id: 101, patient: { fullName: 'John Doe' }, doctor: { fullName: 'Dr. Sarah Jenkins' }, appointmentDate: '2026-10-07T10:00:00', reason: 'Cardiac Follow-up', status: 'CONFIRMED' },
    { id: 102, patient: { fullName: 'Emily Watson' }, doctor: { fullName: 'Dr. Elena Rostova' }, appointmentDate: '2026-10-08T14:30:00', reason: 'Allergy Checkup', status: 'PENDING' },
    { id: 103, patient: { fullName: 'Robert Chen' }, doctor: { fullName: 'Dr. Marcus Vance' }, appointmentDate: '2026-10-05T11:15:00', reason: 'Migraine Eval', status: 'COMPLETED' },
    { id: 104, patient: { fullName: 'Sophia Martinez' }, doctor: { fullName: 'Dr. David Kim' }, appointmentDate: '2026-10-09T09:00:00', reason: 'Orthopedic Consult', status: 'PENDING' }
  ];
  renderAppointmentsTable(mock);
}

function renderAppointmentsTable(list) {
  const tbody = document.getElementById('recentAppointmentsBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: #94a3b8;">No appointments scheduled yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(apt => {
    const dateStr = new Date(apt.appointmentDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    let badgeClass = 'badge-secondary';
    if (apt.status === 'CONFIRMED') badgeClass = 'badge-success';
    else if (apt.status === 'PENDING') badgeClass = 'badge-warning';
    else if (apt.status === 'COMPLETED') badgeClass = 'badge-info';
    else if (apt.status === 'CANCELLED') badgeClass = 'badge-danger';

    return `
      <tr>
        <td><strong>#APT-${apt.id}</strong></td>
        <td>${apt.patient ? (apt.patient.fullName || (apt.patient.firstName + ' ' + apt.patient.lastName)) : 'Unknown'}</td>
        <td>${apt.doctor ? (apt.doctor.fullName || ('Dr. ' + apt.doctor.firstName + ' ' + apt.doctor.lastName)) : 'Unassigned'}</td>
        <td>${dateStr}</td>
        <td><span class="badge ${badgeClass}">${apt.status}</span></td>
      </tr>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadDashboardMetrics();
  loadRecentAppointments();
});
