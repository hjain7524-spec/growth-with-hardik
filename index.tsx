import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initAndCaptureUtm, trackPhoneClick, trackWhatsAppClick } from './analytics';

// Capture UTM parameters & initial traffic source on application mount
if (typeof window !== 'undefined') {
  initAndCaptureUtm();

  // Attach global passive listeners for tel: and whatsapp links
  document.addEventListener('click', (e: MouseEvent) => {
    const target = (e.target as HTMLElement)?.closest('a');
    if (!target) return;
    const href = target.getAttribute('href') || '';
    if (href.startsWith('tel:')) {
      const phone = href.replace('tel:', '');
      trackPhoneClick('direct_link', phone);
    } else if (href.includes('wa.me') || href.includes('whatsapp.com') || href.startsWith('whatsapp:')) {
      trackWhatsAppClick('direct_link');
    }
  }, { passive: true });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
