import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { doctorService } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    departmentName: '',
    qualification: '',
    experienceYears: 10,
    consultationFee: 800
  });

  const loadData = async (dept = '') => {
    try {
      const data = await doctorService.getAll(dept);
      setDoctors(data || []);
    } catch (err) {
      showToast('Error loading doctors roster', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(departmentFilter);
  }, [departmentFilter]);

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
      specialization: '',
      departmentName: '',
      qualification: '',
      experienceYears: 10,
      consultationFee: 800
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newDoc = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        specialization: formData.specialization.trim(),
        department: { id: 1, name: formData.departmentName.trim() },
        qualification: formData.qualification.trim(),
        experienceYears: parseInt(formData.experienceYears) || 1,
        consultationFee: parseFloat(formData.consultationFee) || 800
      };

      await doctorService.add(newDoc);
      showToast('Doctor registered successfully!', 'success');
      handleCloseModal();
      loadData(departmentFilter);
    } catch (err) {
      showToast('Failed to add doctor profile', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this doctor?')) return;
    try {
      await doctorService.delete(id);
      showToast('Doctor removed successfully', 'success');
      loadData(departmentFilter);
    } catch (err) {
      showToast('Failed to remove doctor', 'error');
    }
  };

  const headerSearch = (
    <div className="header-search">
      <i className="fa-solid fa-filter" style={{ color: '#94a3b8' }}></i>
      <select
        id="departmentFilter"
        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem' }}
        value={departmentFilter}
        onChange={(e) => setDepartmentFilter(e.target.value)}
      >
        <option value="">All Departments</option>
        <option value="Cardiology">Cardiology</option>
        <option value="Neurology">Neurology</option>
        <option value="Pediatrics">Pediatrics</option>
        <option value="Orthopedics">Orthopedics</option>
      </select>
    </div>
  );

  const headerAction = (
    <button className="btn btn-primary btn-sm" onClick={handleOpenModal}>
      <i className="fa-solid fa-user-doctor"></i> Add Doctor
    </button>
  );

  return (
    <AppLayout searchContent={headerSearch} actionContent={headerAction}>
      <div className="page-title-bar">
        <div>
          <h1>Medical Specialists Roster</h1>
          <p>Manage department heads, consultant physicians, and surgeons.</p>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="features-grid" id="doctorsGrid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))' }}>
        {doctors.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            {loading ? 'Loading specialists roster...' : 'No doctors found for this specialty.'}
          </div>
        ) : (
          doctors.map((doc) => (
            <div className="feature-card" key={doc.id} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', gap: '1rem', alignSelf: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                <div className="user-avatar" style={{ width: '50px', height: '50px', fontSize: '1.25rem' }}>
                  {(doc.firstName || 'D').charAt(0)}
                </div>
                <div>
                  <h4 style={{ marginBottom: '0.15rem', fontSize: '1.1rem', color: '#0f172a' }}>
                    Dr. {doc.firstName} {doc.lastName}
                  </h4>
                  <span className="badge badge-info">{doc.specialization}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem', lineHeight: '1.6' }}>
                <strong>Department:</strong> {doc.department ? doc.department.name : 'General'}<br />
                <strong>Education:</strong> {doc.qualification || 'MBBS, MD'}<br />
                <strong>Experience:</strong> {doc.experienceYears || 5}+ years<br />
                <strong>Consultation Fee:</strong> ₹{doc.consultationFee || 800}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                  ● Available Today
                </span>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(doc.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Doctor Modal */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} id="doctorModal">
        <div className="modal-box">
          <div className="modal-header">
            <h3>Add Medical Specialist</h3>
            <button className="modal-close" onClick={handleCloseModal}>&times;</button>
          </div>

          <form onSubmit={handleSubmit} id="addDoctorForm">
            <div className="modal-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    placeholder="Marcus"
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
                    placeholder="Vance"
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
                    placeholder="dr.marcus@hospital.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="+1-555-0102"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    className="form-control"
                    placeholder="Cardiologist"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="departmentName"
                    className="form-control"
                    placeholder="Cardiology"
                    value={formData.departmentName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Degree / Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    className="form-control"
                    placeholder="MD, PhD"
                    value={formData.qualification}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Experience (Years)</label>
                  <input
                    type="number"
                    name="experienceYears"
                    className="form-control"
                    min="1"
                    max="50"
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Consultation Fee (₹)</label>
                <input
                  type="number"
                  name="consultationFee"
                  className="form-control"
                  min="0"
                  step="50"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Doctor Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
