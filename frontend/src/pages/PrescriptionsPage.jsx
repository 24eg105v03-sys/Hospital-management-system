import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { prescriptionService } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    diagnosis: '',
    medicineName: '',
    dosage: '',
    duration: '',
    instructions: ''
  });

  const loadData = async (query = '') => {
    try {
      const data = await prescriptionService.getAll(query);
      setPrescriptions(data || []);
    } catch (err) {
      showToast('Error loading prescriptions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = () => {
    setFormData({
      patientName: '',
      doctorName: '',
      diagnosis: '',
      medicineName: '',
      dosage: '',
      duration: '',
      instructions: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newP = {
        patient: { id: 1, fullName: formData.patientName.trim() },
        doctor: { id: 1, fullName: formData.doctorName.trim() },
        diagnosis: formData.diagnosis.trim(),
        instructions: formData.instructions.trim(),
        prescriptionDate: new Date().toISOString().split('T')[0],
        medicines: [{
          medicineName: formData.medicineName.trim(),
          dosage: formData.dosage.trim(),
          duration: formData.duration.trim()
        }]
      };

      await prescriptionService.add(newP);
      showToast('Prescription issued successfully!', 'success');
      handleCloseModal();
      loadData(searchQuery);
    } catch (err) {
      showToast('Failed to create prescription', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;
    try {
      await prescriptionService.delete(id);
      showToast('Prescription removed', 'info');
      loadData(searchQuery);
    } catch (err) {
      showToast('Failed to delete prescription', 'error');
    }
  };

  const headerSearch = (
    <div className="header-search">
      <i className="fa-solid fa-magnifying-glass" style={{ color: '#94a3b8' }}></i>
      <input
        type="text"
        id="prescSearch"
        placeholder="Search prescriptions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );

  const headerAction = (
    <button className="btn btn-primary btn-sm" onClick={handleOpenModal}>
      <i className="fa-solid fa-plus"></i> New Prescription
    </button>
  );

  return (
    <AppLayout searchContent={headerSearch} actionContent={headerAction}>
      <div className="page-title-bar">
        <div>
          <h1>e-Prescription Management</h1>
          <p>Digital medical prescriptions, dosages, and pharmacy dispensing instructions.</p>
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Prescription #</th>
                <th>Patient</th>
                <th>Prescribed By</th>
                <th>Issue Date</th>
                <th>Diagnosis</th>
                <th>Medicines & Dosage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="prescriptionsTableBody">
              {prescriptions.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    {loading ? 'Loading prescriptions...' : 'No prescriptions recorded.'}
                  </td>
                </tr>
              ) : (
                prescriptions.map((p) => {
                  const meds = (p.medicines && p.medicines.length > 0)
                    ? p.medicines.map((m, idx) => (
                        <div key={idx}>
                          <strong>{m.medicineName}</strong> - {m.dosage || ''} ({m.duration || ''})
                        </div>
                      ))
                    : 'Standard prescription';

                  return (
                    <tr key={p.id}>
                      <td><strong>#RX-{p.id}</strong></td>
                      <td><strong>{p.patient?.fullName || 'John Doe'}</strong></td>
                      <td>{p.doctor?.fullName || 'Dr. Specialist'}</td>
                      <td>{p.prescriptionDate || '2026-10-06'}</td>
                      <td><span className="badge badge-info">{p.diagnosis}</span></td>
                      <td><small>{meds}</small></td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(p.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Prescription Modal */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} id="prescModal">
        <div className="modal-box">
          <div className="modal-header">
            <h3>Create e-Prescription</h3>
            <button className="modal-close" onClick={handleCloseModal}>&times;</button>
          </div>

          <form onSubmit={handleSubmit} id="addPrescriptionForm">
            <div className="modal-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Patient Name</label>
                  <input
                    type="text"
                    name="patientName"
                    className="form-control"
                    placeholder="John Doe"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Doctor Name</label>
                  <input
                    type="text"
                    name="doctorName"
                    className="form-control"
                    placeholder="Dr. Sarah Jenkins"
                    value={formData.doctorName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Clinical Diagnosis</label>
                <input
                  type="text"
                  name="diagnosis"
                  className="form-control"
                  placeholder="Acute Bronchitis / Stage 1 Hypertension"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Medicine Name</label>
                  <input
                    type="text"
                    name="medicineName"
                    className="form-control"
                    placeholder="Amoxicillin"
                    value={formData.medicineName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Dosage & Frequency</label>
                  <input
                    type="text"
                    name="dosage"
                    className="form-control"
                    placeholder="500mg, 2x daily after food"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Course Duration</label>
                <input
                  type="text"
                  name="duration"
                  className="form-control"
                  placeholder="7 days"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Physician Instructions</label>
                <textarea
                  name="instructions"
                  className="form-control"
                  rows="2"
                  placeholder="Drink plenty of fluids and rest. Follow-up after 1 week."
                  value={formData.instructions}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save & Issue
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
