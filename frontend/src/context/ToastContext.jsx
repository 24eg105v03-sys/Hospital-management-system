import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="toast-container">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast ${toast.type}`}
            onClick={() => removeToast(toast.id)}
            style={{ cursor: 'pointer' }}
          >
            {toast.type === 'success' && <i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-emerald)' }}></i>}
            {toast.type === 'error' && <i className="fa-solid fa-circle-xmark" style={{ color: 'var(--accent-rose)' }}></i>}
            {toast.type === 'warning' && <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--accent-amber)' }}></i>}
            {toast.type === 'info' && <i className="fa-solid fa-circle-info" style={{ color: 'var(--primary)' }}></i>}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
