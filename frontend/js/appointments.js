/**
 * Hospital Management System - Appointments Controller (appointments.js)
 */

const API_BASE = 'http://localhost:8080/api';

function getAuthHeaders() {
  const token = localStorage.getItem('hms_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

const defaultAppointments = [
  { id: 1, patient: { id: 1, fullName: 'John Doe' }, doctor: { id: 1, fullName: 'Dr. Sarah Jenkins', specialization: 'Cardiology' }, appointmentDate: '2026-10-07T10:00:00', reason: 'Cardiac Follow-up', status: 'CONFIRMED' },
  { id: 2, patient: { id: 2, fullName: 'Emily Watson' }, doctor: { id: 3, fullName: 'Dr. Elena Rostova', specialization: 'Pediatrics' }, appointmentDate: '2026-10-08T14:30:00', reason: 'Allergy Checkup', status: 'PENDING' },
  { id: 3, patient: { id: 3, fullName: 'Robert Chen' }, doctor: { id: 2, fullName: 'Dr. Marcus Vance', specialization: 'Neurology' }, appointmentDate: '2026-10-05T11:15:00', reason: 'Migraine Eval', status: 'COMPLETED' },
  { id: 4, patient: { id: 4, fullName: 'Sophia Martinez' }, doctor: { id: 4, fullName: 'Dr. David Kim', specialization: 'Orthopedics' }, appointmentDate: '2026-10-09T09:00:00', reason: 'Routine Joint Check', status: 'PENDING' }
];

async function loadAppointments(filterStatus = '') {
  const tbody = document.getElementById('appointmentsTableBody');
  if (!tbody) return;

  try {
    const res = await fetch(`${API_BASE}/appointments`, { headers: getAuthHeaders() });
    if (res.ok) {
      let list = await res.json();
      if (filterStatus) {
        list = list.filter(a => a.status === filterStatus);
      }
      renderAppointmentsTable(list);
      return;
    }
  } catch (err) {
    console.warn('Backend unavailable, loading local appointments.');
  }

  if (!localStorage.getItem('local_appointments')) {
    localStorage.setItem('local_appointments', JSON.stringify(defaultAppointments));
  }
  let localList = JSON.parse(localStorage.getItem('local_appointments') || '[]');
  if (filterStatus) {
    localList = localList.filter(a => a.status === filterStatus);
  }
  renderAppointmentsTable(localList);
}

function renderAppointmentsTable(list) {
  const tbody = document.getElementById('appointmentsTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2.5rem; color: #94a3b8;">No appointments found.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(apt => {
    const dateObj = new Date(apt.appointmentDate);
    const dateFormatted = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    const timeFormatted = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let badgeClass = 'badge-secondary';
    if (apt.status === 'CONFIRMED') badgeClass = 'badge-success';
    else if (apt.status === 'PENDING') badgeClass = 'badge-warning';
    else if (apt.status === 'COMPLETED') badgeClass = 'badge-info';
    else if (apt.status === 'CANCELLED') badgeClass = 'badge-danger';

    const pName = apt.patient ? (apt.patient.fullName || `${apt.patient.firstName} ${apt.patient.lastName}`) : 'Patient #' + apt.patientId;
    const dName = apt.doctor ? (apt.doctor.fullName || `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}`) : 'Doctor #' + apt.doctorId;

    return `
      <tr>
        <td><strong>#APT-${apt.id}</strong></td>
        <td><strong>${pName}</strong></td>
        <td>${dName}</td>
        <td>
          <div>${dateFormatted}</div>
          <small style="color: #64748b;">${timeFormatted}</small>
        </td>
        <td>${apt.reason || 'General Consultation'}</td>
        <td><span class="badge ${badgeClass}">${apt.status}</span></td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            ${apt.status === 'PENDING' ? `<button class="btn btn-primary btn-sm" onclick="updateAppointmentStatus(${apt.id}, 'CONFIRMED')">Confirm</button>` : ''}
            ${apt.status === 'CONFIRMED' ? `<button class="btn btn-secondary btn-sm" onclick="updateAppointmentStatus(${apt.id}, 'COMPLETED')">Complete</button>` : ''}
            ${apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' ? `<button class="btn btn-outline-danger btn-sm" onclick="updateAppointmentStatus(${apt.id}, 'CANCELLED')">Cancel</button>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openBookAppointmentModal() {
  document.getElementById('appointmentModal').classList.add('active');
}

function closeBookAppointmentModal() {
  document.getElementById('appointmentModal').classList.remove('active');
  document.getElementById('bookAppointmentForm').reset();
}

async function handleBookAppointment(e) {
  e.preventDefault();
  const form = e.target;
  const newApt = {
    patient: { id: parseInt(form.patientId.value) || 1, fullName: form.patientName.value.trim() },
    doctor: { id: parseInt(form.doctorId.value) || 1, fullName: form.doctorName.value.trim() },
    appointmentDate: `${form.appointmentDate.value}T${form.appointmentTime.value}:00`,
    reason: form.reason.value.trim(),
    notes: form.notes.value.trim(),
    status: 'PENDING'
  };

  try {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newApt)
    });
    if (res.ok) {
      showToast('Appointment booked successfully!', 'success');
      closeBookAppointmentModal();
      loadAppointments();
      return;
    }
  } catch (err) {
    console.warn('Booking locally...', err);
  }

  const localList = JSON.parse(localStorage.getItem('local_appointments') || JSON.stringify(defaultAppointments));
  newApt.id = Date.now();
  localList.unshift(newApt);
  localStorage.setItem('local_appointments', JSON.stringify(localList));

  showToast('Appointment booked successfully (offline mode)!', 'success');
  closeBookAppointmentModal();
  loadAppointments();
}

async function updateAppointmentStatus(id, newStatus) {
  try {
    const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      showToast(`Appointment status updated to ${newStatus}`, 'success');
      loadAppointments();
      return;
    }
  } catch (err) {
    console.warn('Updating status locally...', err);
  }

  const localList = JSON.parse(localStorage.getItem('local_appointments') || JSON.stringify(defaultAppointments));
  const apt = localList.find(a => a.id === id);
  if (apt) {
    apt.status = newStatus;
    localStorage.setItem('local_appointments', JSON.stringify(localList));
  }
  showToast(`Appointment marked as ${newStatus}`, 'success');
  loadAppointments();
}

document.addEventListener('DOMContentLoaded', () => {
  loadAppointments();

  const statusFilter = document.getElementById('statusFilter');
  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      loadAppointments(e.target.value);
    });
  }

  const bookForm = document.getElementById('bookAppointmentForm');
  if (bookForm) {
    bookForm.addEventListener('submit', handleBookAppointment);
  }
});
