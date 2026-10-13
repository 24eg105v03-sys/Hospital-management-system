import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { appointmentService, patientService, doctorService } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    patientId: '1',
    doctorId: '1',
    appointmentDate: '',
    appointmentTime: '10:00',
    reason: '',
    notes: ''
  });

  const loadAppointmentsData = async (status = '') => {
    try {
      const data = await appointmentService.getAll(status);
      setAppointments(data || []);
    } catch (err) {
      showToast('Error loading appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadDropdownOptions = async () => {
    try {
      const [patList, docList] = await Promise.all([
        patientService.getAll().catch(() => []),
        doctorService.getAll().catch(() => [])
      ]);
      setPatients(patList);
      setDoctors(docList);
      if (patList.length > 0 && !formData.patientId) {
        setFormData(prev => ({ ...prev, patientId: String(patList[0].id) }));
      }
      if (docList.length > 0 && !formData.doctorId) {
        setFormData(prev => ({ ...prev, doctorId: String(docList[0].id) }));
      }
    } catch (err) {
      console.warn('Could not load patient/doctor dropdowns', err);
    }
  };

  useEffect(() => {
    loadAppointmentsData(statusFilter);
  }, [statusFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = () => {
    loadDropdownOptions();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    setFormData(prev => ({
      ...prev,
      appointmentDate: dateStr,
      appointmentTime: '10:00',
      reason: '',
      notes: ''
    }));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedPatient = patients.find(p => String(p.id) === String(formData.patientId));
      const pName = selectedPatient
        ? (selectedPatient.fullName || `${selectedPatient.firstName} ${selectedPatient.lastName}`)
        : `Patient #${formData.patientId}`;

      const selectedDoctor = doctors.find(d => String(d.id) === String(formData.doctorId));
      const dName = selectedDoctor
        ? (selectedDoctor.fullName || `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`)
        : `Doctor #${formData.doctorId}`;

      const newApt = {
        patient: { id: parseInt(formData.patientId) || 1, fullName: pName },
        doctor: { id: parseInt(formData.doctorId) || 1, fullName: dName },
        appointmentDate: `${formData.appointmentDate}T${formData.appointmentTime}:00`,
        reason: formData.reason.trim(),
        notes: formData.notes.trim(),
        status: 'PENDING'
      };

      await appointmentService.add(newApt);
      showToast('Appointment booked successfully!', 'success');
      handleCloseModal();
      loadAppointmentsData(statusFilter);
    } catch (err) {
      showToast('Failed to book appointment', 'error');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await appointmentService.updateStatus(id, newStatus);
      showToast(`Appointment status updated to ${newStatus}`, 'success');
      loadAppointmentsData(statusFilter);
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const headerSearch = (
    <div className="header-search">
      <i className="fa-solid fa-filter" style={{ color: '#94a3b8' }}></i>
      <select
        id="statusFilter"
        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem' }}
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All Appointment Statuses</option>
        <option value="PENDING">Pending Approval</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
    </div>
  );

  const headerAction = (
    <button className="btn btn-primary btn-sm" onClick={handleOpenModal}>
      <i className="fa-solid fa-calendar-plus"></i> Book Appointment
    </button>
  );

  return (
    <AppLayout searchContent={headerSearch} actionContent={headerAction}>
      <div className="page-title-bar">
        <div>
          <h1>Appointments & Consultations</h1>
          <p>View upcoming clinic visits, approve pending bookings, and track consultations.</p>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Purpose / Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="appointmentsTableBody">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                    {loading ? 'Loading appointments...' : 'No appointments found.'}
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => {
                  const dateObj = new Date(apt.appointmentDate);
                  const isValidDate = !isNaN(dateObj.getTime());
                  const dateFormatted = isValidDate
                    ? dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'N/A';
                  const timeFormatted = isValidDate
                    ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '';

                  let badgeClass = 'badge-secondary';
                  if (apt.status === 'CONFIRMED') badgeClass = 'badge-success';
                  else if (apt.status === 'PENDING') badgeClass = 'badge-warning';
                  else if (apt.status === 'COMPLETED') badgeClass = 'badge-info';
                  else if (apt.status === 'CANCELLED') badgeClass = 'badge-danger';

                  const pName = apt.patient
                    ? (apt.patient.fullName || `${apt.patient.firstName || ''} ${apt.patient.lastName || ''}`.trim())
                    : `Patient #${apt.patientId || ''}`;
                  const dName = apt.doctor
                    ? (apt.doctor.fullName || `Dr. ${apt.doctor.firstName || ''} ${apt.doctor.lastName || ''}`.trim())
                    : `Doctor #${apt.doctorId || ''}`;

                  return (
                    <tr key={apt.id}>
                      <td><strong>#APT-{apt.id}</strong></td>
                      <td><strong>{pName}</strong></td>
                      <td>{dName}</td>
                      <td>
                        <div>{dateFormatted}</div>
                        {timeFormatted && <small style={{ color: '#64748b' }}>{timeFormatted}</small>}
                      </td>
                      <td>{apt.reason || 'General Consultation'}</td>
                      <td><span className={`badge ${badgeClass}`}>{apt.status}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {apt.status === 'PENDING' && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                            >
                              Confirm
                            </button>
                          )}
                          {apt.status === 'CONFIRMED' && (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleUpdateStatus(apt.id, 'COMPLETED')}
                            >
                              Complete
                            </button>
                          )}
                          {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleUpdateStatus(apt.id, 'CANCELLED')}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} id="appointmentModal">
        <div className="modal-box">
          <div className="modal-header">
            <h3>Book New Consultation</h3>
            <button className="modal-close" onClick={handleCloseModal}>&times;</button>
          </div>

          <form onSubmit={handleSubmit} id="bookAppointmentForm">
            <div className="modal-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Select Patient</label>
                  <select
                    name="patientId"
                    id="modalPatientSelect"
                    className="form-control"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    required
                  >
                    {patients.length === 0 ? (
                      <option value="1">John Doe (#PAT-1)</option>
                    ) : (
                      patients.map(p => {
                        const name = p.fullName || `${p.firstName} ${p.lastName}`;
                        return <option key={p.id} value={p.id}>{name} (#PAT-{p.id})</option>;
                      })
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label>Assigned Specialist</label>
                  <select
                    name="doctorId"
                    id="modalDoctorSelect"
                    className="form-control"
                    value={formData.doctorId}
                    onChange={handleInputChange}
                    required
                  >
                    {doctors.length === 0 ? (
                      <option value="1">Dr. Sarah Jenkins - Cardiologist</option>
                    ) : (
                      doctors.map(d => {
                        const name = d.fullName || `Dr. ${d.firstName} ${d.lastName}`;
                        const spec = d.specialization || (d.department ? d.department.name : 'Specialist');
                        return <option key={d.id} value={d.id}>{name} - {spec}</option>;
                      })
                    )}
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Appointment Date</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    className="form-control"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time Slot</label>
                  <input
                    type="time"
                    name="appointmentTime"
                    className="form-control"
                    value={formData.appointmentTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason for Visit</label>
                <input
                  type="text"
                  name="reason"
                  className="form-control"
                  placeholder="Annual routine physical checkup, chest pain, fever..."
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Clinical Notes (Optional)</label>
                <textarea
                  name="notes"
                  className="form-control"
                  rows="2"
                  placeholder="Patient requested morning slot..."
                  value={formData.notes}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
