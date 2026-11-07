import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useToast } from '../../lib/toast-context.jsx';

const STATUS_LABEL = { new: 'New', contacted: 'Contacted', quoted: 'Quoted', won: 'Won', lost: 'Lost' };
const STATUSES = Object.keys(STATUS_LABEL);

export default function EnquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [enquiry, setEnquiry] = useState(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    api
      .get(`/enquiries/${id}`)
      .then((d) => {
        setEnquiry(d.enquiry);
        setNote(d.enquiry.note || '');
      })
      .catch((e) => setError(e.message));
  }, [id]);

  async function updateStatus(status) {
    try {
      const d = await api.patch(`/enquiries/${id}`, { status });
      setEnquiry(d.enquiry);
      toast.success('Status updated.');
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function saveNote() {
    setSavingNote(true);
    try {
      const d = await api.patch(`/enquiries/${id}`, { note });
      setEnquiry(d.enquiry);
      toast.success('Note saved.');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSavingNote(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete the enquiry from "${enquiry.company}"?`)) return;
    try {
      await api.del(`/enquiries/${id}`);
      toast.success('Enquiry deleted.');
      navigate('/enquiries');
    } catch (e) {
      toast.error(e.message);
    }
  }

  if (error) return <div className="form-error-banner">{error}</div>;
  if (!enquiry) return <div className="admin-loading-inline">Loading enquiry…</div>;

  return (
    <div className="page page-narrow">
      <div className="page-head">
        <Link to="/enquiries" className="link-sm">← Back to enquiries</Link>
        <h1>{enquiry.company}</h1>
        <p>{enquiry.name} · {formatDate(enquiry.created_at)}</p>
      </div>

      <div className="card">
        <div className="card-head">
          <h2>Status</h2>
        </div>
        <div className="status-row">
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`status-pill-btn status-${s}${enquiry.status === s ? ' active' : ''}`}
              onClick={() => updateStatus(s)}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h2>Contact details</h2></div>
        <dl className="detail-grid">
          <dt>Name</dt><dd>{enquiry.name}</dd>
          <dt>Company</dt><dd>{enquiry.company}</dd>
          <dt>Email</dt><dd><a href={`mailto:${enquiry.email}`}>{enquiry.email}</a></dd>
          <dt>Phone</dt><dd>{enquiry.phone || '—'}</dd>
          <dt>Country</dt><dd>{enquiry.country}</dd>
          <dt>Business type</dt><dd>{enquiry.business_type || '—'}</dd>
        </dl>
      </div>

      <div className="card">
        <div className="card-head"><h2>Requirement</h2></div>
        <dl className="detail-grid">
          <dt>Products</dt><dd>{enquiry.products || '—'}</dd>
          <dt>Quantity</dt><dd>{enquiry.quantity || '—'}</dd>
          <dt>Target delivery</dt><dd>{enquiry.timeline || '—'}</dd>
        </dl>
        <p className="detail-message">{enquiry.message}</p>
      </div>

      <div className="card">
        <div className="card-head"><h2>Internal note</h2></div>
        <textarea
          rows={4}
          value={note}
          placeholder="Notes visible only to your team…"
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="form-actions">
          <button className="btn-primary" onClick={saveNote} disabled={savingNote}>
            {savingNote ? 'Saving…' : 'Save note'}
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-ghost-sm danger" onClick={handleDelete}>Delete enquiry</button>
      </div>
    </div>
  );
}

function formatDate(s) {
  const d = new Date(s.replace(' ', 'T') + 'Z');
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
