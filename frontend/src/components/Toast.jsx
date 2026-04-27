import { useState } from 'react';
import './Toast.css';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return { toasts, showToast };
};

export const Toast = ({ message, type = 'info' }) => (
  <div className={`toast toast-${type}`}>
    {message}
  </div>
);