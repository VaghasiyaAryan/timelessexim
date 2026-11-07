import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';

const STATUS_LABEL = { new: 'New', contacted: 'Contacted', quoted: 'Quoted', won: 'Won', lost: 'Lost' };

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/stats')
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="form-error-banner">{error}</div>;
  if (!stats) return <div className="admin-loading-inline">Loading dashboard…</div>;

  const { totals, recentEnquiries, productsByCategory } = stats;
  const maxCategoryCount = Math.max(1, ...productsByCategory.map((c) => c.n));

  return (
    <div className="page">
      <div className="page-head">
        <h1>Dashboard</h1>
        <p>An overview of your catalogue and buyer enquiries.</p>
      </div>

      <div className="stat-grid">
        <StatCard label="Active products" value={totals.activeProducts} sub={`${totals.totalProducts} total`} />
        <StatCard label="Categories" value={totals.totalCategories} />
        <StatCard label="New enquiries" value={totals.newEnquiries} highlight={totals.newEnquiries > 0} />
        <StatCard label="Enquiries (7 days)" value={totals.enquiries7d} />
      </div>

      <div className="dashboard-grid">
        <section className="card">
          <div className="card-head">
            <h2>Products by category</h2>
          </div>
          <div className="bar-list">
            {productsByCategory.map((c) => (
              <div className="bar-row" key={c.name}>
                <span className="bar-label">{c.name}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(c.n / maxCategoryCount) * 100}%` }} />
                </div>
                <span className="bar-value">{c.n}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Recent enquiries</h2>
            <Link to="/enquiries" className="link-sm">View all →</Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <div className="empty-state">No enquiries yet.</div>
          ) : (
            <ul className="recent-list">
              {recentEnquiries.map((e) => (
                <li key={e.id}>
                  <Link to={`/enquiries/${e.id}`} className="recent-item">
                    <div>
                      <div className="recent-title">{e.company}</div>
                      <div className="recent-sub">{e.name} · {e.country}</div>
                    </div>
                    <span className={`status-pill status-${e.status}`}>{STATUS_LABEL[e.status] || e.status}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, highlight }) {
  return (
    <div className={`stat-card${highlight ? ' highlight' : ''}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
