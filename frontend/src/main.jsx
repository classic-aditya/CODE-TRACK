import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import api from './services/api';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

window.__DEBUG__ = true;
api.interceptors.request.use(config => {
  if (window.__DEBUG__) console.log('API Request:', config);
  return config;
});

