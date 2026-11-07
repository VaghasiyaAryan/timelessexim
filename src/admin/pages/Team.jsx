import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../lib/auth-context.jsx';
import { useToast } from '../../lib/toast-context.jsx';
import { SECTIONS, sectionLabel } from '../../lib/permissions.js';

const DEPARTMENTS = ['Sales', 'Export', 'Marketing', 'Production', 'Quality Control', 'Logistics', 'Accounts', 'Management'];
const EMPTY = { name: '', email: '', password: '', role: 'employee', department: '', permissions: [], active: true };

export default function Team() {
  const { user } = useAuth();
  const toast = useToast();
  const [team, setTeam] = useState(null);
  // null = no form open; { type: 'create' | 'edit' | 'reset', member? }
  const [mode, setMode] = useState(null);

  useEffect(() => {
    api.get('/team').then((d) => setTeam(d.team)).catch((e) => toast.error(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(m) {
    if (!confirm(`Delete ${m.name || m.email}'s account? They will no longer be able to sign in.`)) return;
    try {
      const d = await api.del(`/team/${m.id}`);
      setTeam(d.team);
      toast.success('Team member deleted.');
    } catch (err) {
      toast.error(err.message);
    }
  }

  const admins = team?.filter((m) => m.role === 'admin').length ?? 0;

  return (
    <div className="page">
      <div className="page-head page-head-row">
        <div>
          <h1>Team</h1>
          <p>Create admin and employee accounts and choose which departments each employee can access.</p>
        </div>
        {!mode && (
          <button className="btn-primary" onClick={() => setMode({ type: 'create' })}>+ Add team member</button>
        )}
      </div>

      {mode?.type === 'create' && (
        <MemberForm
          onCancel={() => setMode(null)}
          onSaved={(t) => { setTeam(t); setMode(null); toast.success('Team member created. Share their email and password with them.'); }}
        />
      )}
      {mode?.type === 'edit' && (
        <MemberForm
          member={mode.member}
          isSelf={mode.member.id === user.id}
          onCancel={() => setMode(null)}
          onSaved={(t) => { setTeam(t); setMode(null); toast.success('Changes saved.'); }}
        />
      )}
      {mode?.type === 'reset' && (
        <ResetPasswordForm member={mode.member} onDone={() => setMode(null)} />
      )}

      {team === null ? (
        <div className="admin-loading-inline">Loading team…</div>
      ) : (
        <>
          <div className="team-summary muted">
            {team.length} {team.length === 1 ? 'person' : 'people'} · {admins} admin{admins === 1 ? '' : 's'} · {team.length - admins} employee{team.length - admins === 1 ? '' : 's'}
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Access</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {team.map((m) => (
                  <tr key={m.id} className={m.active ? '' : 'row-inactive'}>
                    <td>
                      <div className="table-title-link">
                        {m.name || '—'} {m.id === user.id && <span className="you-tag">You</span>}
                      </div>
                      <div className="muted">{m.email}</div>
                    </td>
                    <td><span className={`role-badge role-${m.role}`}>{m.role === 'admin' ? 'Admin' : 'Employee'}</span></td>
                    <td>{m.department || <span className="muted">—</span>}</td>
                    <td>
                      {m.role === 'admin' ? (
                        <span className="access-chip full">Full access</span>
                      ) : (
                        <div className="access-chips">
                          {m.permissions.map((p) => <span key={p} className="access-chip">{sectionLabel(p)}</span>)}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`status-pill ${m.active ? 'status-won' : 'status-lost'}`}>{m.active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="cell-actions">
                      <button className="btn-ghost-sm" onClick={() => setMode({ type: 'edit', member: m })}>Edit</button>
                      <button className="btn-ghost-sm" onClick={() => setMode({ type: 'reset', member: m })}>Reset password</button>
                      {m.id !== user.id && (
                        <button className="btn-ghost-sm danger" onClick={() => handleDelete(m)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function MemberForm({ member, isSelf = false, onCancel, onSaved }) {
  const editing = !!member;
  const [form, setForm] = useState(() => (member ? { ...EMPTY, ...member, password: '' } : EMPTY));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const isAdmin = form.role === 'admin';

  function togglePermission(key) {
    set('permissions', form.permissions.includes(key) ? form.permissions.filter((p) => p !== key) : [...form.permissions, key]);
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!isAdmin && !form.permissions.length) {
      setError('Tick at least one department this employee can access.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        role: form.role,
        department: form.department,
        permissions: form.permissions,
        ...(editing ? { active: form.active } : { email: form.email, password: form.password }),
      };
      const d = editing ? await api.put(`/team/${member.id}`, payload) : await api.post('/team', payload);
      onSaved(d.team);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card form-card-admin team-form" onSubmit={submit}>
      <div className="card-head">
        <h2>{editing ? `Edit ${member.name || member.email}` : 'New team member'}</h2>
      </div>
      {error && <div className="form-error-banner">{error}</div>}

      <div className="form-grid-2">
        <div className="field">
          <label className="field-label">Full name</label>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Priya Shah" required />
        </div>
        <div className="field">
          <label className="field-label">Email (used to sign in)</label>
          <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="name@timelessexim.com" disabled={editing} required />
        </div>
      </div>

      {!editing && (
        <div className="field">
          <label className="field-label">Temporary password</label>
          <input type="text" autoComplete="new-password" value={form.password} onChange={(e) => set('password', e.target.value)} minLength={8} placeholder="At least 8 characters" required />
          <div className="field-hint">Share this with them. They can change it later in Settings.</div>
        </div>
      )}

      <div className="field">
        <label className="field-label">Role</label>
        <div className="role-options">
          <label className={`role-option ${!isAdmin ? 'selected' : ''} ${isSelf ? 'disabled' : ''}`}>
            <input type="radio" name="role" checked={!isAdmin} disabled={isSelf} onChange={() => set('role', 'employee')} />
            <span><strong>Employee</strong><small>Only the departments you choose below</small></span>
          </label>
          <label className={`role-option ${isAdmin ? 'selected' : ''}`}>
            <input type="radio" name="role" checked={isAdmin} onChange={() => set('role', 'admin')} />
            <span><strong>Admin</strong><small>Everything, including managing the team</small></span>
          </label>
        </div>
        {isSelf && <div className="field-hint">You can't remove your own admin access.</div>}
      </div>

      <div className="field">
        <label className="field-label">Department</label>
        <input list="team-departments" value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="e.g. Sales" maxLength={60} />
        <datalist id="team-departments">{DEPARTMENTS.map((d) => <option key={d} value={d} />)}</datalist>
      </div>

      <div className="field">
        <label className="field-label">Department access</label>
        {isAdmin ? (
          <div className="field-hint">Admins can access every section.</div>
        ) : (
          <div className="access-options">
            {SECTIONS.map((s) => (
              <label key={s.key} className={`access-option ${form.permissions.includes(s.key) ? 'selected' : ''}`}>
                <input type="checkbox" checked={form.permissions.includes(s.key)} onChange={() => togglePermission(s.key)} />
                <span><strong>{s.label}</strong><small>{s.hint}</small></span>
              </label>
            ))}
          </div>
        )}
      </div>

      {editing && !isSelf && (
        <label className="checkbox-label">
          <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} />
          Account active (untick to block sign-in without deleting the account)
        </label>
      )}

      <div className="form-actions">
        <button type="button" className="btn-ghost-sm" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Create account'}
        </button>
      </div>
    </form>
  );
}

function ResetPasswordForm({ member, onDone }) {
  const toast = useToast();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post(`/team/${member.id}/reset-password`, { password });
      toast.success(`Password reset for ${member.name || member.email}. They've been signed out of other devices.`);
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card form-card-admin team-form" onSubmit={submit}>
      <div className="card-head"><h2>Reset password for {member.name || member.email}</h2></div>
      {error && <div className="form-error-banner">{error}</div>}
      <div className="field">
        <label className="field-label">New temporary password</label>
        <input type="text" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} placeholder="At least 8 characters" required autoFocus />
      </div>
      <div className="form-actions">
        <button type="button" className="btn-ghost-sm" onClick={onDone}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Reset password'}</button>
      </div>
    </form>
  );
}
