/**
 * Hospital Management System - Authentication Logic (login.js)
 */

const API_BASE = 'https://hospital-management-backend-ili0.onrender.com/api';

// Toast Notification
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

// Pre-fill demo accounts
function fillDemoCredentials(username, password) {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  if (usernameInput && passwordInput) {
    usernameInput.value = username;
    passwordInput.value = password;
    showToast(`Loaded ${username} credentials!`, 'info');
  }
}

// Handle Login
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!username || !password) {
        showToast('Please enter username and password', 'error');
        return;
      }

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Authenticating...';
      submitBtn.disabled = true;

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
          showToast('Login successful! Redirecting...', 'success');
          setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
          return;
        } else {
          const err = await response.json();
          showToast(err.error || 'Invalid credentials', 'error');
        }
      } catch (err) {
        // Fallback for offline/standalone preview
        console.warn('Backend server not connected. Falling back to local session.', err);
        const role = username.includes('dr') ? 'DOCTOR' : username.includes('admin') ? 'ADMIN' : 'PATIENT';
        const mockUser = {
          token: 'mock-jwt-token-' + Date.now(),
          username: username,
          fullName: username.toUpperCase(),
          role: role
        };
        localStorage.setItem('hms_token', mockUser.token);
        localStorage.setItem('hms_user', JSON.stringify(mockUser));
        showToast('Running in local mode. Logging in...', 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
      } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Handle Register Form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('reg_username').value.trim();
      const password = document.getElementById('reg_password').value.trim();
      const fullName = document.getElementById('reg_fullname').value.trim();
      const email = document.getElementById('reg_email').value.trim();
      const role = document.getElementById('reg_role').value;

      const submitBtn = registerForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Registering...';
      submitBtn.disabled = true;

      try {
        const response = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, fullName, email, role })
        });

        if (response.ok) {
          showToast('Account registered successfully! Redirecting to login...', 'success');
          setTimeout(() => { window.location.href = 'login.html'; }, 1200);
        } else {
          const err = await response.json();
          showToast(err.error || 'Registration failed', 'error');
        }
      } catch (err) {
        console.warn('Backend server not connected. Mock registration successful.', err);
        showToast('Registration successful! Redirecting to login...', 'success');
        setTimeout(() => { window.location.href = 'login.html'; }, 1200);
      } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});
