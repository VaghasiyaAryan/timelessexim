import '../styles/admin.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '../lib/auth-context.jsx';
import { ToastProvider } from '../lib/toast-context.jsx';

import AdminLayout from './AdminLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import ProductForm from './pages/ProductForm.jsx';
import Categories from './pages/Categories.jsx';
import Enquiries from './pages/Enquiries.jsx';
import EnquiryDetail from './pages/EnquiryDetail.jsx';
import Settings from './pages/Settings.jsx';
import Team from './pages/Team.jsx';
import { can, firstAllowedPath } from '../lib/permissions.js';

document.title = 'Admin — Timeless Exim';

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user === undefined) {
    return (
      <div className="admin-splash">
        <div className="spinner" />
      </div>
    );
  }
  if (user === null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

// Shows the page only to team members with access to its section; others go to a section they can use
function Allow({ section, children }) {
  const { user } = useAuth();
  if (can(user, section)) return children;
  const fallback = firstAllowedPath(user);
  return section === 'dashboard' && fallback !== '/' ? <Navigate to={fallback} replace /> : <NoAccess />;
}

function NoAccess() {
  return (
    <div className="page page-narrow">
      <div className="page-head">
        <h1>No access</h1>
        <p>You don't have access to this section. Ask an admin to add it to your account.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/admin" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Allow section="dashboard"><Dashboard /></Allow>} />
              <Route path="products" element={<Allow section="products"><Products /></Allow>} />
              <Route path="products/new" element={<Allow section="products"><ProductForm /></Allow>} />
              <Route path="products/:id" element={<Allow section="products"><ProductForm /></Allow>} />
              <Route path="categories" element={<Allow section="categories"><Categories /></Allow>} />
              <Route path="enquiries" element={<Allow section="enquiries"><Enquiries /></Allow>} />
              <Route path="enquiries/:id" element={<Allow section="enquiries"><EnquiryDetail /></Allow>} />
              <Route path="team" element={<Allow section="team"><Team /></Allow>} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
