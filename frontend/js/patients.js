/**
 * Hospital Management System - Patients Controller (patients.js)
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

let patientsData = [];

// Fallback patients
const defaultPatients = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '+1-555-1101', dateOfBirth: '1985-04-12', gender: 'Male', bloodGroup: 'O+', address: '742 Evergreen Terrace', medicalHistory: 'Hypertension diagnosed 2021' },
  { id: 2, firstName: 'Emily', lastName: 'Watson', email: 'emily.watson@example.com', phone: '+1-555-1102', dateOfBirth: '1992-09-23', gender: 'Female', bloodGroup: 'A+', address: '104 Maple Street', medicalHistory: 'Mild seasonal asthma' },
  { id: 3, firstName: 'Robert', lastName: 'Chen', email: 'robert.chen@example.com', phone: '+1-555-1103', dateOfBirth: '1978-01-30', gender: 'Male', bloodGroup: 'B-', address: '55 Broadway Ave', medicalHistory: 'No chronic conditions' },
  { id: 4, firstName: 'Sophia', lastName: 'Martinez', email: 'sophia.m@example.com', phone: '+1-555-1104', dateOfBirth: '2018-06-15', gender: 'Female', bloodGroup: 'AB+', address: '88 Sunset Blvd', medicalHistory: 'Routine vaccination up to date' }
];

async function loadPatients(searchQuery = '') {
  const tbody = document.getElementById('patientsTableBody');
  if (!tbody) return;

  try {
    const url = searchQuery 
      ? `${API_BASE}/patients?search=${encodeURIComponent(searchQuery)}`
      : `${API_BASE}/patients`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (res.ok) {
      patientsData = await res.json();
      renderPatientsTable(patientsData);
      return;
    }
  } catch (e) {
    console.warn('Backend not reachable, loading fallback patients data.');
  }

  // Fallback
  if (!localStorage.getItem('local_patients')) {
    localStorage.setItem('local_patients', JSON.stringify(defaultPatients));
  }
  const localList = JSON.parse(localStorage.getItem('local_patients') || '[]');
  patientsData = searchQuery
    ? localList.filter(p => (p.firstName + ' ' + p.lastName).toLowerCase().includes(searchQuery.toLowerCase()))
    : localList;
  renderPatientsTable(patientsData);
}

function renderPatientsTable(list) {
  const tbody = document.getElementById('patientsTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2.5rem; color: #94a3b8;">No patients found matching your search.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(p => `
    <tr>
      <td><strong>#PAT-${p.id}</strong></td>
      <td>
        <div style="font-weight: 600; color: #0f172a;">${p.firstName} ${p.lastName}</div>
        <small style="color: #64748b;">${p.email || 'No email'}</small>
      </td>
      <td>${p.phone || 'N/A'}</td>
      <td><span class="badge badge-info">${p.gender || 'Other'}</span></td>
      <td><span class="badge badge-danger">${p.bloodGroup || 'N/A'}</span></td>
      <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        ${p.medicalHistory || 'None'}
      </td>
      <td>
        <button class="btn btn-outline-danger btn-sm" onclick="deletePatient(${p.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function openAddPatientModal() {
  document.getElementById('patientModal').classList.add('active');
}

function closeAddPatientModal() {
  document.getElementById('patientModal').classList.remove('active');
  document.getElementById('addPatientForm').reset();
}

async function handleAddPatient(e) {
  e.preventDefault();
  const form = e.target;
  const newPatient = {
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    dateOfBirth: form.dateOfBirth.value,
    gender: form.gender.value,
    bloodGroup: form.bloodGroup.value,
    address: form.address.value.trim(),
    medicalHistory: form.medicalHistory.value.trim()
  };

  try {
    const res = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newPatient)
    });
    if (res.ok) {
      showToast('Patient added successfully!', 'success');
      closeAddPatientModal();
      loadPatients();
      return;
    }
  } catch (err) {
    console.warn('Saving patient locally...', err);
  }

  // Local fallback save
  const localList = JSON.parse(localStorage.getItem('local_patients') || JSON.stringify(defaultPatients));
  newPatient.id = Date.now();
  localList.unshift(newPatient);
  localStorage.setItem('local_patients', JSON.stringify(localList));

  showToast('Patient added successfully (offline mode)!', 'success');
  closeAddPatientModal();
  loadPatients();
}

async function deletePatient(id) {
  if (!confirm('Are you sure you want to delete this patient record?')) return;

  try {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (res.ok) {
      showToast('Patient deleted successfully', 'success');
      loadPatients();
      return;
    }
  } catch (err) {
    console.warn('Deleting locally...', err);
  }

  const localList = JSON.parse(localStorage.getItem('local_patients') || JSON.stringify(defaultPatients));
  const filtered = localList.filter(p => p.id !== id);
  localStorage.setItem('local_patients', JSON.stringify(filtered));
  showToast('Patient record deleted', 'success');
  loadPatients();
}

document.addEventListener('DOMContentLoaded', () => {
  loadPatients();

  const searchInput = document.getElementById('patientSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      loadPatients(e.target.value.trim());
    });
  }

  const addForm = document.getElementById('addPatientForm');
  if (addForm) {
    addForm.addEventListener('submit', handleAddPatient);
  }
});
