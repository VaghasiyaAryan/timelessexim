import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useToast } from '../../lib/toast-context.jsx';

export default function Products() {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const toast = useToast();

  async function load() {
    const params = new URLSearchParams({ all: '1' });
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (status) params.set('status', status);
    const [p, c] = await Promise.all([
      api.get(`/products?${params.toString()}`),
      categories.length ? Promise.resolve({ categories }) : api.get('/categories'),
    ]);
    setProducts(p.products);
    if (!categories.length) setCategories(c.categories);
  }

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, status]);

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await api.del(`/products/${product.id}`);
      toast.success('Product deleted.');
      setProducts((list) => list.filter((p) => p.id !== product.id));
    } catch (e) {
      toast.error(e.message);
    }
  }

  const categoryOptions = useMemo(() => categories, [categories]);

  return (
    <div className="page">
      <div className="page-head page-head-row">
        <div>
          <h1>Products</h1>
          <p>Manage the catalogue shown on the public site.</p>
        </div>
        <Link to="/products/new" className="btn-primary">+ New product</Link>
      </div>

      <div className="toolbar">
        <input
          className="toolbar-search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categoryOptions.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {products === null ? (
        <div className="admin-loading-inline">Loading products…</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products match your filters.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="cell-thumb">
                    {p.image_url ? <img src={p.image_url} alt="" /> : <div className="thumb-placeholder" />}
                  </td>
                  <td>
                    <Link to={`/products/${p.id}`} className="table-title-link">{p.name}</Link>
                  </td>
                  <td>{p.category_name || <span className="muted">—</span>}</td>
                  <td>
                    <span className={`status-pill status-${p.status === 'active' ? 'won' : 'new'}`}>
                      {p.status === 'active' ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td>{p.featured ? '★' : ''}</td>
                  <td className="cell-actions">
                    <Link to={`/products/${p.id}`} className="btn-ghost-sm">Edit</Link>
                    <button className="btn-ghost-sm danger" onClick={() => handleDelete(p)}>Delete</button>
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
