// Admin-panel sections ("departments") a team member can be given access to.
// Mirrors server/permissions.js — the server enforces access; this only shapes the UI.
export const SECTIONS = [
  { key: 'dashboard', label: 'Dashboard', path: '/', hint: 'Business overview and stats' },
  { key: 'products', label: 'Products', path: '/products', hint: 'Add and edit the product catalogue' },
  { key: 'categories', label: 'Categories', path: '/categories', hint: 'Organise products into categories' },
  { key: 'enquiries', label: 'Enquiries', path: '/enquiries', hint: 'Read and follow up buyer enquiries' },
];

export const sectionLabel = (key) => SECTIONS.find((s) => s.key === key)?.label || key;

export function can(user, section) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return section !== 'team' && (user.permissions || []).includes(section);
}

// Where to send someone who can't see the dashboard
export function firstAllowedPath(user) {
  return SECTIONS.find((s) => can(user, s.key))?.path ?? '/settings';
}
