import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/app';
import { initSentry } from '@/config/sentry';
import './index.css';

initSentry();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
