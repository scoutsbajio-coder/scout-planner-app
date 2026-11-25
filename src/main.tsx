import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './services/install';
import './styles/global.css';

// Elimina las cachés manuales de versiones anteriores (ahora el precaché lo gestiona Workbox).
if ('caches' in window && import.meta.env.PROD) {
  caches.keys()
    .then((keys) => Promise.all(keys.filter((key) => key.startsWith('scout-planner-')).map((key) => caches.delete(key))))
    .catch(() => undefined);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
