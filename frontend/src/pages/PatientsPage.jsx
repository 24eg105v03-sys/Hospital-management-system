import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { patientService } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '',
    medicalHistory: ''
  });

  const loadData = async (query = '') => {
    try {
      const data = await patientService.getAll(query);
      setPatients(data || []);
    } catch (err) {
      showToast('Error loading patients', 'error');
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
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'Male',
      bloodGroup: 'O+',
      address: '',
      medicalHistory: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await patientService.add(formData);
      showToast('Patient added successfully!', 'success');
      handleCloseModal();
      loadData(searchQuery);
    } catch (err) {
      showToast('Failed to add patient', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient record?')) return;
    try {
      await patientService.delete(id);
      showToast('Patient deleted successfully', 'success');
      loadData(searchQuery);
    } catch (err) {
      showToast('Failed to delete patient', 'error');
    }
  };

  const headerSearch = (
    <div className="header-search">
      <i className="fa-solid fa-magnifying-glass" style={{ color: '#94a3b8' }}></i>
      <input
        type="text"
        id="patientSearchInput"
        placeholder="Filter by patient name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );

  const headerAction = (
    <button className="btn btn-primary btn-sm" onClick={handleOpenModal}>
      <i className="fa-solid fa-user-plus"></i> Add New Patient
    </button>
  );

  return (
    <AppLayout searchContent={headerSearch} actionContent={headerAction}>
      <div className="page-title-bar">
        <div>
          <h1>Patients Directory</h1>
          <p>Register, inspect, and update electronic medical records.</p>
        </div>
      </div>

      {/* Patients Data Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Patient Details</th>
                <th>Contact Phone</th>
                <th>Gender</th>
                <th>Blood Group</th>
                <th>Medical History</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="patientsTableBody">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                    {loading ? 'Loading patients...' : 'No patients found matching your search.'}
                  </td>
                </tr>
              ) : (
                patients.map(p => (
                  <tr key={p.id}>
                    <td><strong>#PAT-{p.id}</strong></td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>
                        {p.firstName} {p.lastName}
                      </div>
                      <small style={{ color: '#64748b' }}>{p.email || 'No email'}</small>
                    </td>
                    <td>{p.phone || 'N/A'}</td>
                    <td><span className="badge badge-info">{p.gender || 'Other'}</span></td>
                    <td><span className="badge badge-danger">{p.bloodGroup || 'N/A'}</span></td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.medicalHistory || 'None'}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Patient Modal */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} id="patientModal">
        <div className="modal-box">
          <div className="modal-header">
            <h3>Add New Patient Record</h3>
            <button className="modal-close" onClick={handleCloseModal}>&times;</button>
          </div>

          <form onSubmit={handleSubmit} id="addPatientForm">
            <div className="modal-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="+1-555-0199"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="form-control"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    className="form-control"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Blood Group</label>
                  <select
                    name="bloodGroup"
                    className="form-control"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    placeholder="City, Street"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Known Allergies / Medical History</label>
                <textarea
                  name="medicalHistory"
                  className="form-control"
                  rows="3"
                  placeholder="Diabetes, penicillin allergy, past surgeries..."
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
