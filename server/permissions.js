// Roles and the admin-panel sections ("departments") a team member can be given access to.
// Admins can use every section plus Team management; employees only the sections listed on their account.
export const ROLES = ['admin', 'employee'];
export const SECTIONS = ['dashboard', 'products', 'categories', 'enquiries'];

export function can(user, section) {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return section !== 'team' && (user.permissions || []).includes(section);
}

export function cleanPermissions(list) {
  return Array.isArray(list) ? SECTIONS.filter((s) => list.includes(s)) : [];
}
