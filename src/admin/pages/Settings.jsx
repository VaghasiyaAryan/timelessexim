import { useState } from 'react';
import { useAuth } from '../../lib/auth-context.jsx';
import { useToast } from '../../lib/toast-context.jsx';
import { api } from '../../lib/api.js';
import PasswordInput from '../PasswordInput.jsx';

export default function Settings() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  async function saveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const d = await api.put('/auth/profile', { name });
      setUser(d.admin);
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setPasswordError('');
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setSavingPassword(true);
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      toast.success('Password changed.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="page page-narrow">
      <div className="page-head">
        <h1>Settings</h1>
        <p>Manage your account.</p>
      </div>

      <form className="card form-card-admin" onSubmit={saveProfile}>
        <div className="card-head"><h2>Profile</h2></div>
        <div className="field">
          <label className="field-label">Email</label>
          <input value={user?.email || ''} disabled />
        </div>
        <div className="field">
          <label className="field-label">Display name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Admin" />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={savingProfile}>
            {savingProfile ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </form>

      <form className="card form-card-admin" onSubmit={changePassword}>
        <div className="card-head"><h2>Change password</h2></div>
        {passwordError && <div className="form-error-banner">{passwordError}</div>}
        <div className="field">
          <label className="field-label">Current password</label>
          <PasswordInput
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-grid-2">
          <div className="field">
            <label className="field-label">New password</label>
            <PasswordInput
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <div className="field">
            <label className="field-label">Confirm new password</label>
            <PasswordInput
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={savingPassword}>
            {savingPassword ? 'Updating…' : 'Update password'}
          </button>
        </div>
      </form>
    </div>
  );
}
