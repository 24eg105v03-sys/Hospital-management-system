/**
 * Hospital Management System - Doctors Controller (doctors.js)
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

const defaultDoctors = [
  { id: 1, firstName: 'Sarah', lastName: 'Jenkins', email: 'sarah.jenkins@hospital.com', phone: '+1-555-0101', specialization: 'Cardiologist', department: { name: 'Cardiology' }, qualification: 'MD, FACC', experienceYears: 12, consultationFee: 1200 },
  { id: 2, firstName: 'Marcus', lastName: 'Vance', email: 'marcus.vance@hospital.com', phone: '+1-555-0102', specialization: 'Neurologist', department: { name: 'Neurology' }, qualification: 'MD, PhD', experienceYears: 15, consultationFee: 1500 },
  { id: 3, firstName: 'Elena', lastName: 'Rostova', email: 'elena.rostova@hospital.com', phone: '+1-555-0103', specialization: 'Pediatrician', department: { name: 'Pediatrics' }, qualification: 'MD', experienceYears: 8, consultationFee: 800 },
  { id: 4, firstName: 'David', lastName: 'Kim', email: 'david.kim@hospital.com', phone: '+1-555-0104', specialization: 'Orthopedic Surgeon', department: { name: 'Orthopedics' }, qualification: 'MS, FRCS', experienceYears: 10, consultationFee: 1000 }
];

async function loadDoctors(departmentFilter = '') {
  const container = document.getElementById('doctorsGrid');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/doctors`, { headers: getAuthHeaders() });
    if (res.ok) {
      let list = await res.json();
      if (departmentFilter) {
        list = list.filter(d => d.department && d.department.name.toLowerCase() === departmentFilter.toLowerCase());
      }
      renderDoctorsGrid(list);
      return;
    }
  } catch (err) {
    console.warn('Backend unavailable, loading local doctors.');
  }

  if (!localStorage.getItem('local_doctors')) {
    localStorage.setItem('local_doctors', JSON.stringify(defaultDoctors));
  }
  let localList = JSON.parse(localStorage.getItem('local_doctors') || '[]');
  if (departmentFilter) {
    localList = localList.filter(d => d.department && d.department.name.toLowerCase() === departmentFilter.toLowerCase());
  }
  renderDoctorsGrid(localList);
}

function renderDoctorsGrid(list) {
  const container = document.getElementById('doctorsGrid');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: #94a3b8;">No doctors found for this specialty.</div>`;
    return;
  }

  container.innerHTML = list.map(doc => `
    <div class="feature-card" style="position: relative;">
      <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
        <div class="user-avatar" style="width: 50px; height: 50px; font-size: 1.25rem;">
          ${doc.firstName.charAt(0)}
        </div>
        <div>
          <h4 style="margin-bottom: 0.15rem; font-size: 1.1rem; color: #0f172a;">Dr. ${doc.firstName} ${doc.lastName}</h4>
          <span class="badge badge-info">${doc.specialization}</span>
        </div>
      </div>
      
      <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.5rem;">
        <strong>Department:</strong> ${doc.department ? doc.department.name : 'General'}<br>
        <strong>Education:</strong> ${doc.qualification || 'MBBS, MD'}<br>
        <strong>Experience:</strong> ${doc.experienceYears || 5}+ years<br>
        <strong>Consultation Fee:</strong> ₹${doc.consultationFee || 800}
      </p>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; pt-2; border-top: 1px solid #f1f5f9;">
        <span style="font-size: 0.8rem; color: #10b981; font-weight: 600;">● Available Today</span>
        <button class="btn btn-outline-danger btn-sm" onclick="deleteDoctor(${doc.id})">Remove</button>
      </div>
    </div>
  `).join('');
}

function openAddDoctorModal() {
  document.getElementById('doctorModal').classList.add('active');
}

function closeAddDoctorModal() {
  document.getElementById('doctorModal').classList.remove('active');
  document.getElementById('addDoctorForm').reset();
}

async function handleAddDoctor(e) {
  e.preventDefault();
  const form = e.target;
  const newDoctor = {
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    specialization: form.specialization.value.trim(),
    department: { id: 1, name: form.departmentName.value.trim() },
    qualification: form.qualification.value.trim(),
    experienceYears: parseInt(form.experienceYears.value) || 1,
    consultationFee: parseFloat(form.consultationFee.value) || 800
  };

  try {
    const res = await fetch(`${API_BASE}/doctors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newDoctor)
    });
    if (res.ok) {
      showToast('Doctor registered successfully!', 'success');
      closeAddDoctorModal();
      loadDoctors();
      return;
    }
  } catch (err) {
    console.warn('Saving doctor locally...', err);
  }

  const localList = JSON.parse(localStorage.getItem('local_doctors') || JSON.stringify(defaultDoctors));
  newDoctor.id = Date.now();
  localList.unshift(newDoctor);
  localStorage.setItem('local_doctors', JSON.stringify(localList));

  showToast('Doctor added successfully (local mode)!', 'success');
  closeAddDoctorModal();
  loadDoctors();
}

async function deleteDoctor(id) {
  if (!confirm('Are you sure you want to remove this doctor?')) return;

  try {
    const res = await fetch(`${API_BASE}/doctors/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (res.ok) {
      showToast('Doctor removed successfully', 'success');
      loadDoctors();
      return;
    }
  } catch (err) {
    console.warn('Deleting locally...', err);
  }

  const localList = JSON.parse(localStorage.getItem('local_doctors') || JSON.stringify(defaultDoctors));
  const filtered = localList.filter(d => d.id !== id);
  localStorage.setItem('local_doctors', JSON.stringify(filtered));
  showToast('Doctor profile removed', 'success');
  loadDoctors();
}

document.addEventListener('DOMContentLoaded', () => {
  loadDoctors();

  const deptFilter = document.getElementById('departmentFilter');
  if (deptFilter) {
    deptFilter.addEventListener('change', (e) => {
      loadDoctors(e.target.value);
    });
  }

  const addDocForm = document.getElementById('addDoctorForm');
  if (addDocForm) {
    addDocForm.addEventListener('submit', handleAddDoctor);
  }
});
