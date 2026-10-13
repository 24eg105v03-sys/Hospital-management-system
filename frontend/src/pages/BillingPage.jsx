import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { billingService } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function BillingPage() {
  const [bills, setBills] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [metrics, setMetrics] = useState({
    billed: 4500,
    collected: 2700,
    pending: 1800
  });

  const [formData, setFormData] = useState({
    patientName: '',
    totalAmount: 1200,
    discount: 0,
    paidAmount: 1200,
    paymentMethod: 'Card'
  });

  const loadData = async (filter = '') => {
    try {
      const data = await billingService.getAll(filter);
      const list = data || [];
      setBills(list);

      // Recalculate KPI metrics
      let totalB = 0;
      let totalC = 0;
      list.forEach(b => {
        totalB += (b.totalAmount || 0) - (b.discount || 0);
        totalC += (b.paidAmount || 0);
      });

      setMetrics({
        billed: totalB,
        collected: totalC,
        pending: Math.max(0, totalB - totalC)
      });
    } catch (err) {
      showToast('Error loading invoices', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(statusFilter);
  }, [statusFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'totalAmount' || name === 'discount' || name === 'paidAmount') ? parseFloat(value) || 0 : value
    }));
  };

  const handleOpenModal = () => {
    setFormData({
      patientName: '',
      totalAmount: 1200,
      discount: 0,
      paidAmount: 1200,
      paymentMethod: 'Card'
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const total = parseFloat(formData.totalAmount) || 0;
      const disc = parseFloat(formData.discount) || 0;
      const paid = parseFloat(formData.paidAmount) || 0;
      const net = total - disc;
      const status = paid >= net ? 'PAID' : (paid > 0 ? 'PARTIAL' : 'UNPAID');

      const newBill = {
        patient: { id: 1, fullName: formData.patientName.trim() },
        billDate: new Date().toISOString().split('T')[0],
        totalAmount: total,
        discount: disc,
        paidAmount: paid,
        paymentStatus: status,
        paymentMethod: formData.paymentMethod
      };

      await billingService.add(newBill);
      showToast('Invoice generated successfully!', 'success');
      handleCloseModal();
      loadData(statusFilter);
    } catch (err) {
      showToast('Failed to create invoice', 'error');
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await billingService.markAsPaid(id);
      showToast('Invoice marked as Settled (PAID)', 'success');
      loadData(statusFilter);
    } catch (err) {
      showToast('Failed to update payment', 'error');
    }
  };

  const headerSearch = (
    <div className="header-search">
      <i className="fa-solid fa-filter" style={{ color: '#94a3b8' }}></i>
      <select
        id="billStatusFilter"
        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem' }}
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All Invoices</option>
        <option value="PAID">Paid</option>
        <option value="UNPAID">Unpaid</option>
      </select>
    </div>
  );

  const headerAction = (
    <button className="btn btn-primary btn-sm" onClick={handleOpenModal}>
      <i className="fa-solid fa-file-circle-plus"></i> Generate Invoice
    </button>
  );

  return (
    <AppLayout searchContent={headerSearch} actionContent={headerAction}>
      <div className="page-title-bar">
        <div>
          <h1>Invoices & Billing</h1>
          <p>Financial ledger, patient checkout receipts, and payment settlements.</p>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="metric-card">
          <div>
            <div className="metric-val" id="totalBilled">
              ₹{metrics.billed.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="metric-lbl">Total Billed</div>
          </div>
          <div className="metric-icon-box stat-blue">
            <i className="fa-solid fa-receipt"></i>
          </div>
        </div>

        <div className="metric-card">
          <div>
            <div className="metric-val" id="totalCollected">
              ₹{metrics.collected.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="metric-lbl">Amount Collected</div>
          </div>
          <div className="metric-icon-box stat-emerald">
            <i className="fa-solid fa-circle-check"></i>
          </div>
        </div>

        <div className="metric-card">
          <div>
            <div className="metric-val" id="totalPending">
              ₹{metrics.pending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="metric-lbl">Outstanding Balance</div>
          </div>
          <div className="metric-icon-box stat-teal">
            <i className="fa-solid fa-clock"></i>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Patient</th>
                <th>Billing Date</th>
                <th>Total Amount</th>
                <th>Discount</th>
                <th>Paid Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="billingTableBody">
              {bills.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    {loading ? 'Loading invoices...' : 'No invoices found.'}
                  </td>
                </tr>
              ) : (
                bills.map((b) => {
                  const isPaid = b.paymentStatus === 'PAID';
                  const badge = isPaid ? 'badge-success' : 'badge-danger';

                  return (
                    <tr key={b.id}>
                      <td><strong>#INV-{b.id}</strong></td>
                      <td><strong>{b.patient?.fullName || 'John Doe'}</strong></td>
                      <td>{b.billDate || '2026-10-06'}</td>
                      <td><strong>₹{(b.totalAmount || 0).toFixed(2)}</strong></td>
                      <td>₹{(b.discount || 0).toFixed(2)}</td>
                      <td style={{ color: '#047857', fontWeight: 600 }}>
                        ₹{(b.paidAmount || 0).toFixed(2)}
                      </td>
                      <td>{b.paymentMethod || 'Card'}</td>
                      <td><span className={`badge ${badge}`}>{b.paymentStatus}</span></td>
                      <td>
                        {!isPaid ? (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleMarkAsPaid(b.id)}
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <span style={{ color: '#10b981', fontSize: '0.85rem' }}>
                            <i className="fa-solid fa-check"></i> Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Bill Modal */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} id="billModal">
        <div className="modal-box">
          <div className="modal-header">
            <h3>Generate Patient Invoice</h3>
            <button className="modal-close" onClick={handleCloseModal}>&times;</button>
          </div>

          <form onSubmit={handleSubmit} id="createBillForm">
            <div className="modal-body">
              <div className="form-group">
                <label>Patient Full Name</label>
                <input
                  type="text"
                  name="patientName"
                  className="form-control"
                  placeholder="e.g. John Doe"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Total Consultation / Hospital Fee (₹)</label>
                  <input
                    type="number"
                    name="totalAmount"
                    id="billTotal"
                    className="form-control"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Discount (₹)</label>
                  <input
                    type="number"
                    name="discount"
                    id="billDiscount"
                    className="form-control"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Paid Amount (₹)</label>
                  <input
                    type="number"
                    name="paidAmount"
                    id="billPaid"
                    className="form-control"
                    value={formData.paidAmount}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    name="paymentMethod"
                    className="form-control"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="UPI">UPI / Online</option>
                    <option value="Insurance">Health Insurance</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Generate Invoice
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
