import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context.jsx';
import { useToast } from '../lib/toast-context.jsx';
import { can } from '../lib/permissions.js';
import {
  DashboardIcon, ProductsIcon, CategoriesIcon, EnquiriesIcon, TeamIcon, SettingsIcon, ExternalLinkIcon, SignOutIcon,
} from './icons.jsx';

// section: the permission needed to see the link (none = everyone signed in)
const NAV = [
  { to: '/', label: 'Dashboard', section: 'dashboard', end: true, Icon: DashboardIcon },
  { to: '/products', label: 'Products', section: 'products', Icon: ProductsIcon },
  { to: '/categories', label: 'Categories', section: 'categories', Icon: CategoriesIcon },
  { to: '/enquiries', label: 'Enquiries', section: 'enquiries', Icon: EnquiriesIcon },
  { to: '/team', label: 'Team', section: 'team', Icon: TeamIcon },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  async function handleLogout() {
    await logout();
    toast.info('Signed out.');
    navigate('/login', { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark">TE</span>
          <div>
            <div className="admin-brand-name">Timeless Exim</div>
            <div className="admin-brand-tag">Admin Panel</div>
          </div>
        </div>
        <nav className="admin-nav">
          {NAV.filter((item) => !item.section || can(user, item.section)).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}
            >
              <item.Icon />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <a href="/" target="_blank" rel="noreferrer" className="admin-view-site">
            <ExternalLinkIcon />
            View public site
          </a>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div />
          <div className="admin-topbar-user">
            <span className="admin-user-name">{user?.name?.trim() || user?.email}</span>
            <span className={`role-badge role-${user?.role}`}>{user?.role === 'admin' ? 'Admin' : user?.department || 'Employee'}</span>
            <button className="btn-ghost-sm btn-signout" onClick={handleLogout}>
              <SignOutIcon />
              Sign out
            </button>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
