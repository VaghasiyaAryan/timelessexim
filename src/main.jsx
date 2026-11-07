import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';

// One build, two apps: the public website and the admin panel (/admin).
// Each is loaded on demand so visitors never download admin code, and each brings its own styles.
const isAdmin = /^\/admin(\/|$)/.test(window.location.pathname);
const load = isAdmin ? import('./admin/AdminApp.jsx') : import('./site/SiteApp.jsx');

load.then(({ default: App }) => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
      <Analytics />
    </React.StrictMode>
  );
});
