/**
 * Hospital Management System - API & Data Services (api.js)
 * Full backend integration with localhost:8080/api and seamless offline fallbacks.
 */

export const API_BASE = 'http://localhost:8080/api';

export function getAuthHeaders() {
  const token = localStorage.getItem('hms_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

// Default initial datasets (matching the original project)
export const defaultPatients = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '+1-555-1101', dateOfBirth: '1985-04-12', gender: 'Male', bloodGroup: 'O+', address: '742 Evergreen Terrace', medicalHistory: 'Hypertension diagnosed 2021' },
  { id: 2, firstName: 'Emily', lastName: 'Watson', email: 'emily.watson@example.com', phone: '+1-555-1102', dateOfBirth: '1992-09-23', gender: 'Female', bloodGroup: 'A+', address: '104 Maple Street', medicalHistory: 'Mild seasonal asthma' },
  { id: 3, firstName: 'Robert', lastName: 'Chen', email: 'robert.chen@example.com', phone: '+1-555-1103', dateOfBirth: '1978-01-30', gender: 'Male', bloodGroup: 'B-', address: '55 Broadway Ave', medicalHistory: 'No chronic conditions' },
  { id: 4, firstName: 'Sophia', lastName: 'Martinez', email: 'sophia.m@example.com', phone: '+1-555-1104', dateOfBirth: '2018-06-15', gender: 'Female', bloodGroup: 'AB+', address: '88 Sunset Blvd', medicalHistory: 'Routine vaccination up to date' }
];

export const defaultDoctors = [
  { id: 1, firstName: 'Sarah', lastName: 'Jenkins', email: 'sarah.jenkins@hospital.com', phone: '+1-555-0101', specialization: 'Cardiologist', department: { name: 'Cardiology' }, qualification: 'MD, FACC', experienceYears: 12, consultationFee: 1200 },
  { id: 2, firstName: 'Marcus', lastName: 'Vance', email: 'marcus.vance@hospital.com', phone: '+1-555-0102', specialization: 'Neurologist', department: { name: 'Neurology' }, qualification: 'MD, PhD', experienceYears: 15, consultationFee: 1500 },
  { id: 3, firstName: 'Elena', lastName: 'Rostova', email: 'elena.rostova@hospital.com', phone: '+1-555-0103', specialization: 'Pediatrician', department: { name: 'Pediatrics' }, qualification: 'MD', experienceYears: 8, consultationFee: 800 },
  { id: 4, firstName: 'David', lastName: 'Kim', email: 'david.kim@hospital.com', phone: '+1-555-0104', specialization: 'Orthopedic Surgeon', department: { name: 'Orthopedics' }, qualification: 'MS, FRCS', experienceYears: 10, consultationFee: 1000 }
];

export const defaultAppointments = [
  { id: 101, patient: { id: 1, fullName: 'John Doe', firstName: 'John', lastName: 'Doe' }, doctor: { id: 1, fullName: 'Dr. Sarah Jenkins', specialization: 'Cardiology' }, appointmentDate: '2026-10-07T10:00:00', reason: 'Cardiac Follow-up', status: 'CONFIRMED' },
  { id: 102, patient: { id: 2, fullName: 'Emily Watson', firstName: 'Emily', lastName: 'Watson' }, doctor: { id: 3, fullName: 'Dr. Elena Rostova', specialization: 'Pediatrics' }, appointmentDate: '2026-10-08T14:30:00', reason: 'Allergy Checkup', status: 'PENDING' },
  { id: 103, patient: { id: 3, fullName: 'Robert Chen', firstName: 'Robert', lastName: 'Chen' }, doctor: { id: 2, fullName: 'Dr. Marcus Vance', specialization: 'Neurology' }, appointmentDate: '2026-10-05T11:15:00', reason: 'Migraine Eval', status: 'COMPLETED' },
  { id: 104, patient: { id: 4, fullName: 'Sophia Martinez', firstName: 'Sophia', lastName: 'Martinez' }, doctor: { id: 4, fullName: 'Dr. David Kim', specialization: 'Orthopedics' }, appointmentDate: '2026-10-09T09:00:00', reason: 'Routine Joint Check', status: 'PENDING' }
];

export const defaultPrescriptions = [
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

export const defaultBills = [
  { id: 1, patient: { fullName: 'John Doe' }, billDate: '2026-10-06', totalAmount: 1500.0, discount: 100.0, paidAmount: 1400.0, paymentStatus: 'PAID', paymentMethod: 'Card' },
  { id: 2, patient: { fullName: 'Emily Watson' }, billDate: '2026-10-06', totalAmount: 1200.0, discount: 0.0, paidAmount: 0.0, paymentStatus: 'UNPAID', paymentMethod: 'Cash' },
  { id: 3, patient: { fullName: 'Robert Chen' }, billDate: '2026-10-05', totalAmount: 1800.0, discount: 200.0, paidAmount: 1600.0, paymentStatus: 'PAID', paymentMethod: 'UPI' }
];

// Helper to initialize and retrieve localStorage cache
function getLocalItem(key, fallback) {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function setLocalItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Authentication Service
export const authService = {
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('hms_token', data.token);
        localStorage.setItem('hms_user', JSON.stringify(data));
        return { success: true, data };
      } else {
        const err = await response.json().catch(() => ({}));
        return { success: false, error: err.error || 'Invalid credentials' };
      }
    } catch (err) {
      console.warn('Backend server not connected. Falling back to local session.', err);
      const role = username.toLowerCase().includes('dr') ? 'DOCTOR' : username.toLowerCase().includes('admin') ? 'ADMIN' : 'PATIENT';
      const mockUser = {
        token: 'mock-jwt-token-' + Date.now(),
        username: username,
        fullName: username.toUpperCase(),
        role: role
      };
      localStorage.setItem('hms_token', mockUser.token);
      localStorage.setItem('hms_user', JSON.stringify(mockUser));
      return { success: true, data: mockUser, offline: true };
    }
  },

  async register({ username, password, fullName, email, role }) {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, fullName, email, role })
      });
      if (response.ok) {
        return { success: true };
      } else {
        const err = await response.json().catch(() => ({}));
        return { success: false, error: err.error || 'Registration failed' };
      }
    } catch (err) {
      console.warn('Backend server not connected. Mock registration successful.', err);
      return { success: true, offline: true };
    }
  },

  logout() {
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_user');
  },

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('hms_user') || 'null');
    } catch {
      return null;
    }
  }
};

// Patients Service
export const patientService = {
  async getAll(searchQuery = '') {
    try {
      const url = searchQuery 
        ? `${API_BASE}/patients?search=${encodeURIComponent(searchQuery)}`
        : `${API_BASE}/patients`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Patients API unreachable, using local storage.');
    }
    const local = getLocalItem('local_patients', defaultPatients);
    if (!searchQuery) return local;
    return local.filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()));
  },

  async add(newPatient) {
    try {
      const res = await fetch(`${API_BASE}/patients`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newPatient)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Patients API error on save, saving locally.');
    }
    const local = getLocalItem('local_patients', defaultPatients);
    const created = { ...newPatient, id: Date.now() };
    local.unshift(created);
    setLocalItem('local_patients', local);
    return created;
  },

  async delete(id) {
    try {
      const res = await fetch(`${API_BASE}/patients/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn('Patients API delete failed, deleting locally.');
    }
    const local = getLocalItem('local_patients', defaultPatients);
    const updated = local.filter(p => p.id !== id);
    setLocalItem('local_patients', updated);
    return true;
  }
};

// Doctors Service
export const doctorService = {
  async getAll(departmentFilter = '') {
    try {
      const res = await fetch(`${API_BASE}/doctors`, { headers: getAuthHeaders() });
      if (res.ok) {
        let list = await res.json();
        if (departmentFilter) {
          list = list.filter(d => d.department && d.department.name.toLowerCase() === departmentFilter.toLowerCase());
        }
        return list;
      }
    } catch (e) {
      console.warn('Doctors API unreachable, using local storage.');
    }
    const local = getLocalItem('local_doctors', defaultDoctors);
    if (!departmentFilter) return local;
    return local.filter(d => d.department && d.department.name.toLowerCase() === departmentFilter.toLowerCase());
  },

  async add(newDoctor) {
    try {
      const res = await fetch(`${API_BASE}/doctors`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newDoctor)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Doctors API error on save, saving locally.');
    }
    const local = getLocalItem('local_doctors', defaultDoctors);
    const created = { ...newDoctor, id: Date.now() };
    local.unshift(created);
    setLocalItem('local_doctors', local);
    return created;
  },

  async delete(id) {
    try {
      const res = await fetch(`${API_BASE}/doctors/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn('Doctors API delete failed, deleting locally.');
    }
    const local = getLocalItem('local_doctors', defaultDoctors);
    const updated = local.filter(d => d.id !== id);
    setLocalItem('local_doctors', updated);
    return true;
  }
};

// Appointments Service
export const appointmentService = {
  async getAll(statusFilter = '') {
    try {
      const res = await fetch(`${API_BASE}/appointments`, { headers: getAuthHeaders() });
      if (res.ok) {
        let list = await res.json();
        if (statusFilter) {
          list = list.filter(a => a.status === statusFilter);
        }
        return list;
      }
    } catch (e) {
      console.warn('Appointments API unreachable, using local storage.');
    }
    const local = getLocalItem('local_appointments', defaultAppointments);
    if (!statusFilter) return local;
    return local.filter(a => a.status === statusFilter);
  },

  async getToday() {
    try {
      const res = await fetch(`${API_BASE}/appointments/today`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Appointments today API unreachable, using local count.');
    }
    return defaultAppointments.slice(0, 2);
  },

  async add(newApt) {
    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newApt)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Appointments API error on save, saving locally.');
    }
    const local = getLocalItem('local_appointments', defaultAppointments);
    const created = { ...newApt, id: Date.now() };
    local.unshift(created);
    setLocalItem('local_appointments', local);
    return created;
  },

  async updateStatus(id, newStatus) {
    try {
      const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Appointments API status update failed, updating locally.');
    }
    const local = getLocalItem('local_appointments', defaultAppointments);
    const apt = local.find(a => a.id === id);
    if (apt) {
      apt.status = newStatus;
      setLocalItem('local_appointments', local);
    }
    return apt;
  }
};

// Prescriptions Service
export const prescriptionService = {
  async getAll(searchQuery = '') {
    try {
      const res = await fetch(`${API_BASE}/prescriptions`, { headers: getAuthHeaders() });
      if (res.ok) {
        let list = await res.json();
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          list = list.filter(p => 
            (p.patient?.fullName && p.patient.fullName.toLowerCase().includes(q)) ||
            (p.doctor?.fullName && p.doctor.fullName.toLowerCase().includes(q)) ||
            (p.diagnosis && p.diagnosis.toLowerCase().includes(q))
          );
        }
        return list;
      }
    } catch (e) {
      console.warn('Prescriptions API unreachable, using local storage.');
    }
    let local = getLocalItem('local_prescriptions', defaultPrescriptions);
    if (!searchQuery) return local;
    const q = searchQuery.toLowerCase();
    return local.filter(p => 
      (p.patient?.fullName && p.patient.fullName.toLowerCase().includes(q)) ||
      (p.doctor?.fullName && p.doctor.fullName.toLowerCase().includes(q)) ||
      (p.diagnosis && p.diagnosis.toLowerCase().includes(q))
    );
  },

  async add(newP) {
    try {
      const res = await fetch(`${API_BASE}/prescriptions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newP)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const local = getLocalItem('local_prescriptions', defaultPrescriptions);
    const created = { ...newP, id: Date.now() };
    local.unshift(created);
    setLocalItem('local_prescriptions', local);
    return created;
  },

  async delete(id) {
    try {
      await fetch(`${API_BASE}/prescriptions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (e) {}
    const local = getLocalItem('local_prescriptions', defaultPrescriptions);
    const updated = local.filter(p => p.id !== id);
    setLocalItem('local_prescriptions', updated);
    return true;
  }
};

// Billing Service
export const billingService = {
  async getAll(filterStatus = '') {
    try {
      const res = await fetch(`${API_BASE}/billing`, { headers: getAuthHeaders() });
      if (res.ok) {
        let list = await res.json();
        if (filterStatus) {
          list = list.filter(b => b.paymentStatus === filterStatus);
        }
        return list;
      }
    } catch (e) {
      console.warn('Billing API unreachable, using local storage.');
    }
    const local = getLocalItem('local_bills', defaultBills);
    if (!filterStatus) return local;
    return local.filter(b => b.paymentStatus === filterStatus);
  },

  async getRevenue() {
    try {
      const res = await fetch(`${API_BASE}/billing/revenue`, { headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { totalRevenue: 2700.0 };
  },

  async add(newBill) {
    try {
      const res = await fetch(`${API_BASE}/billing`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newBill)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const local = getLocalItem('local_bills', defaultBills);
    const created = { ...newBill, id: Date.now() };
    local.unshift(created);
    setLocalItem('local_bills', local);
    return created;
  },

  async markAsPaid(id) {
    try {
      await fetch(`${API_BASE}/billing/${id}/payment`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'PAID', paymentMethod: 'Card' })
      });
    } catch (e) {}
    const local = getLocalItem('local_bills', defaultBills);
    const bill = local.find(b => b.id === id);
    if (bill) {
      bill.paymentStatus = 'PAID';
      bill.paidAmount = bill.totalAmount - (bill.discount || 0);
      setLocalItem('local_bills', local);
    }
    return bill;
  }
};
