/**
 * Hospital Management System - Billing & Invoices Logic (billing.js)
 */

const API_BASE = 'http://localhost:8080/api';

const defaultBills = [
  { id: 1, patient: { fullName: 'John Doe' }, billDate: '2026-10-06', totalAmount: 1500.0, discount: 100.0, paidAmount: 1400.0, paymentStatus: 'PAID', paymentMethod: 'Card' },
  { id: 2, patient: { fullName: 'Emily Watson' }, billDate: '2026-10-06', totalAmount: 1200.0, discount: 0.0, paidAmount: 0.0, paymentStatus: 'UNPAID', paymentMethod: 'Cash' },
  { id: 3, patient: { fullName: 'Robert Chen' }, billDate: '2026-10-05', totalAmount: 1800.0, discount: 200.0, paidAmount: 1600.0, paymentStatus: 'PAID', paymentMethod: 'UPI' }
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

async function loadBills(filterStatus = '') {
  const tbody = document.getElementById('billingTableBody');
  if (!tbody) return;

  let list = defaultBills;
  try {
    const res = await fetch(`${API_BASE}/billing`, {
      headers: { ...getAuthHeader() }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        list = data;
      }
    }
  } catch (e) {
    const stored = localStorage.getItem('local_bills');
    if (stored) list = JSON.parse(stored);
  }

  if (filterStatus) {
    list = list.filter(b => b.paymentStatus === filterStatus);
  }

  let billed = 0, collected = 0;
  list.forEach(b => {
    billed += (b.totalAmount || 0) - (b.discount || 0);
    collected += (b.paidAmount || 0);
  });

  const totalBilledEl = document.getElementById('totalBilled');
  const totalCollectedEl = document.getElementById('totalCollected');
  const totalPendingEl = document.getElementById('totalPending');

  if (totalBilledEl) totalBilledEl.innerText = '₹' + billed.toFixed(2);
  if (totalCollectedEl) totalCollectedEl.innerText = '₹' + collected.toFixed(2);
  if (totalPendingEl) totalPendingEl.innerText = '₹' + Math.max(0, (billed - collected)).toFixed(2);

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:2rem; color:#94a3b8;">No invoices found.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(b => {
    const isPaid = b.paymentStatus === 'PAID';
    const badge = isPaid ? 'badge-success' : 'badge-danger';
    return `
      <tr>
        <td><strong>#INV-${b.id}</strong></td>
        <td><strong>${b.patient?.fullName || 'John Doe'}</strong></td>
        <td>${b.billDate || '2026-10-06'}</td>
        <td><strong>₹${(b.totalAmount || 0).toFixed(2)}</strong></td>
        <td>₹${(b.discount || 0).toFixed(2)}</td>
        <td style="color: #047857; font-weight: 600;">₹${(b.paidAmount || 0).toFixed(2)}</td>
        <td>${b.paymentMethod || 'Card'}</td>
        <td><span class="badge ${badge}">${b.paymentStatus}</span></td>
        <td>
          ${!isPaid ? `<button class="btn btn-primary btn-sm" onclick="markAsPaid(${b.id})">Mark Paid</button>` : `<span style="color:#10b981; font-size:0.85rem;"><i class="fa-solid fa-check"></i> Settled</span>`}
        </td>
      </tr>
    `;
  }).join('');
}

function openCreateBillModal() {
  const modal = document.getElementById('billModal');
  if (modal) modal.classList.add('active');
}

function closeCreateBillModal() {
  const modal = document.getElementById('billModal');
  if (modal) modal.classList.remove('active');
  const form = document.getElementById('createBillForm');
  if (form) form.reset();
}

async function markAsPaid(id) {
  try {
    await fetch(`${API_BASE}/billing/${id}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status: 'PAID', paymentMethod: 'Card' })
    });
  } catch (err) {}

  const localList = JSON.parse(localStorage.getItem('local_bills') || JSON.stringify(defaultBills));
  const bill = localList.find(b => b.id === id);
  if (bill) {
    bill.paymentStatus = 'PAID';
    bill.paidAmount = bill.totalAmount - (bill.discount || 0);
    localStorage.setItem('local_bills', JSON.stringify(localList));
  }
  showToast('Invoice marked as Settled (PAID)', 'success');
  loadBills();
}

document.addEventListener('DOMContentLoaded', () => {
  loadBills();

  const filter = document.getElementById('billStatusFilter');
  if (filter) {
    filter.addEventListener('change', (e) => loadBills(e.target.value));
  }

  const form = document.getElementById('createBillForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const total = parseFloat(form.totalAmount.value);
      const disc = parseFloat(form.discount.value) || 0;
      const paid = parseFloat(form.paidAmount.value) || 0;
      const status = paid >= (total - disc) ? 'PAID' : (paid > 0 ? 'PARTIAL' : 'UNPAID');

      const newBill = {
        id: Date.now(),
        patient: { id: 1, fullName: form.patientName.value },
        billDate: new Date().toISOString().split('T')[0],
        totalAmount: total,
        discount: disc,
        paidAmount: paid,
        paymentStatus: status,
        paymentMethod: form.paymentMethod.value
      };

      try {
        await fetch(`${API_BASE}/billing`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify(newBill)
        });
      } catch (err) {}

      const localList = JSON.parse(localStorage.getItem('local_bills') || JSON.stringify(defaultBills));
      localList.unshift(newBill);
      localStorage.setItem('local_bills', JSON.stringify(localList));

      showToast('Invoice generated successfully!', 'success');
      closeCreateBillModal();
      loadBills();
    });
  }
});
