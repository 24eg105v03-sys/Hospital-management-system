/**
 * Hospital Management System - Prescriptions Management (prescriptions.js)
 */

const API_BASE = 'http://localhost:8080/api';

const defaultPrescriptions = [
  {
    id: 1,
    patient: { fullName: 'John Doe' },
    doctor: { fullName: 'Dr. Sarah Jenkins' },
    prescriptionDate: '2026-10-06',
    diagnosis: 'Essential Hypertension',
    instructions: 'Low sodium diet, monitor BP daily',
    medicines: [{ medicineName: 'Amlodipine 5mg', dosage: 'Once daily morning', duration: '30 days' }]
  },
  {
    id: 2,
    patient: { fullName: 'Emily Watson' },
    doctor: { fullName: 'Dr. Elena Rostova' },
    prescriptionDate: '2026-10-05',
    diagnosis: 'Allergic Rhinitis',
    instructions: 'Avoid dust triggers',
    medicines: [{ medicineName: 'Cetirizine 10mg', dosage: 'Once daily night', duration: '14 days' }]
  }
];

function getAuthHeader() {
  const token = localStorage.getItem('hms_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
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

async function loadPrescriptions() {
  const tbody = document.getElementById('prescriptionsTableBody');
  if (!tbody) return;

  let list = defaultPrescriptions;
  try {
    const res = await fetch(`${API_BASE}/prescriptions`, {
      headers: { ...getAuthHeader() }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        list = data;
      }
    }
  } catch (e) {
    const stored = localStorage.getItem('local_prescriptions');
    if (stored) list = JSON.parse(stored);
  }

  const searchInput = document.getElementById('prescSearch');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  if (query) {
    list = list.filter(p => 
      (p.patient?.fullName && p.patient.fullName.toLowerCase().includes(query)) ||
      (p.doctor?.fullName && p.doctor.fullName.toLowerCase().includes(query)) ||
      (p.diagnosis && p.diagnosis.toLowerCase().includes(query))
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:#94a3b8;">No prescriptions recorded.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(p => {
    const meds = (p.medicines && p.medicines.length > 0)
      ? p.medicines.map(m => `<div><strong>${m.medicineName}</strong> - ${m.dosage || ''} (${m.duration || ''})</div>`).join('')
      : 'Standard prescription';
    return `
      <tr>
        <td><strong>#RX-${p.id}</strong></td>
        <td><strong>${p.patient?.fullName || 'John Doe'}</strong></td>
        <td>${p.doctor?.fullName || 'Dr. Specialist'}</td>
        <td>${p.prescriptionDate || '2026-10-06'}</td>
        <td><span class="badge badge-info">${p.diagnosis}</span></td>
        <td><small>${meds}</small></td>
        <td>
          <button class="btn btn-outline-danger btn-sm" onclick="deletePrescription(${p.id})">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openAddPrescriptionModal() {
  const modal = document.getElementById('prescModal');
  if (modal) modal.classList.add('active');
}

function closeAddPrescriptionModal() {
  const modal = document.getElementById('prescModal');
  if (modal) modal.classList.remove('active');
  const form = document.getElementById('addPrescriptionForm');
  if (form) form.reset();
}

async function deletePrescription(id) {
  if (!confirm('Are you sure you want to delete this prescription?')) return;
  try {
    await fetch(`${API_BASE}/prescriptions/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
  } catch (err) {}

  const localList = JSON.parse(localStorage.getItem('local_prescriptions') || JSON.stringify(defaultPrescriptions));
  const filtered = localList.filter(p => p.id !== id);
  localStorage.setItem('local_prescriptions', JSON.stringify(filtered));
  showToast('Prescription removed', 'info');
  loadPrescriptions();
}

document.addEventListener('DOMContentLoaded', () => {
  loadPrescriptions();

  const prescSearch = document.getElementById('prescSearch');
  if (prescSearch) {
    prescSearch.addEventListener('input', loadPrescriptions);
  }

  const form = document.getElementById('addPrescriptionForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newP = {
        id: Date.now(),
        patient: { id: 1, fullName: form.patientName.value },
        doctor: { id: 1, fullName: form.doctorName.value },
        diagnosis: form.diagnosis.value,
        instructions: form.instructions.value,
        prescriptionDate: new Date().toISOString().split('T')[0],
        medicines: [{
          medicineName: form.medicineName.value,
          dosage: form.dosage.value,
          duration: form.duration.value
        }]
      };

      try {
        await fetch(`${API_BASE}/prescriptions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify(newP)
        });
      } catch (err) {}

      const localList = JSON.parse(localStorage.getItem('local_prescriptions') || JSON.stringify(defaultPrescriptions));
      localList.unshift(newP);
      localStorage.setItem('local_prescriptions', JSON.stringify(localList));

      showToast('Prescription issued successfully!', 'success');
      closeAddPrescriptionModal();
      loadPrescriptions();
    });
  }
});
