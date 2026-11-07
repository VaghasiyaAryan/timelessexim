import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useToast } from '../../lib/toast-context.jsx';

const STATUS_LABEL = { new: 'New', contacted: 'Contacted', quoted: 'Quoted', won: 'Won', lost: 'Lost' };
const STATUSES = Object.keys(STATUS_LABEL);

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const toast = useToast();

  async function load() {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    const d = await api.get(`/enquiries?${params.toString()}`);
    setEnquiries(d.enquiries);
  }

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  async function handleDelete(e, item) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete the enquiry from "${item.company}"?`)) return;
    try {
      await api.del(`/enquiries/${item.id}`);
      toast.success('Enquiry deleted.');
      setEnquiries((list) => list.filter((x) => x.id !== item.id));
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Enquiries</h1>
        <p>Buyer requests submitted through the contact form.</p>
      </div>

      <div className="toolbar">
        <input
          className="toolbar-search"
          placeholder="Search by name, company, email, country…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>
      </div>

      {enquiries === null ? (
        <div className="admin-loading-inline">Loading enquiries…</div>
      ) : enquiries.length === 0 ? (
        <div className="empty-state">No enquiries match your filters.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company / Contact</th>
                <th>Country</th>
                <th>Products</th>
                <th>Status</th>
                <th>Received</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e.id}>
                  <td>
                    <Link to={`/enquiries/${e.id}`} className="table-title-link">{e.company}</Link>
                    <div className="muted">{e.name} · {e.email}</div>
                  </td>
                  <td>{e.country}</td>
                  <td className="truncate">{e.products}</td>
                  <td>
                    <span className={`status-pill status-${e.status}`}>{STATUS_LABEL[e.status] || e.status}</span>
                  </td>
                  <td className="muted">{formatDate(e.created_at)}</td>
                  <td className="cell-actions">
                    <button className="btn-ghost-sm danger" onClick={(ev) => handleDelete(ev, e)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function formatDate(s) {
  const d = new Date(s.replace(' ', 'T') + 'Z');
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
