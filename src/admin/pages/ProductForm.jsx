import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useToast } from '../../lib/toast-context.jsx';

const EMPTY = {
  name: '',
  category_id: '',
  description: '',
  specs: [],
  image_url: '',
  featured: false,
  status: 'active',
};

export default function ProductForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [specInput, setSpecInput] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/categories').then((d) => setCategories(d.categories));
  }, []);

  useEffect(() => {
    if (isNew) return;
    api
      .get(`/products/${id}`)
      .then((d) =>
        setForm({
          name: d.product.name,
          category_id: d.product.category_id || '',
          description: d.product.description,
          specs: d.product.specs,
          image_url: d.product.image_url,
          featured: d.product.featured,
          status: d.product.status,
        })
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function addSpec() {
    const v = specInput.trim();
    if (!v) return;
    if (!form.specs.includes(v)) update('specs', [...form.specs, v]);
    setSpecInput('');
  }

  function removeSpec(spec) {
    update('specs', form.specs.filter((s) => s !== spec));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form, category_id: form.category_id || null };
      if (isNew) {
        await api.post('/products', payload);
        toast.success('Product created.');
      } else {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated.');
      }
      navigate('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="admin-loading-inline">Loading product…</div>;

  return (
    <div className="page page-narrow">
      <div className="page-head">
        <Link to="/products" className="link-sm">← Back to products</Link>
        <h1>{isNew ? 'New product' : 'Edit product'}</h1>
      </div>

      {error && <div className="form-error-banner">{error}</div>}

      <form className="card form-card-admin" onSubmit={handleSubmit}>
        <div className="form-grid-2">
          <div className="field">
            <label className="field-label">Name *</label>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </div>
          <div className="field">
            <label className="field-label">Category</label>
            <select value={form.category_id} onChange={(e) => update('category_id', e.target.value)}>
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label className="field-label">Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} />
        </div>

        <div className="field">
          <label className="field-label">Image URL</label>
          <input
            value={form.image_url}
            onChange={(e) => update('image_url', e.target.value)}
            placeholder="https://…"
          />
          {form.image_url && (
            <div className="image-preview">
              <img src={form.image_url} alt="" />
            </div>
          )}
        </div>

        <div className="field">
          <label className="field-label">Specs / tags</label>
          <div className="spec-editor">
            {form.specs.map((s) => (
              <span className="spec-chip" key={s}>
                {s}
                <button type="button" onClick={() => removeSpec(s)} aria-label={`Remove ${s}`}>×</button>
              </span>
            ))}
            <input
              className="spec-input"
              value={specInput}
              placeholder="Type and press Enter"
              onChange={(e) => setSpecInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  addSpec();
                }
              }}
              onBlur={addSpec}
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="field">
            <label className="field-label">Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              <option value="active">Active (visible on site)</option>
              <option value="draft">Draft (hidden)</option>
            </select>
          </div>
          <div className="field field-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update('featured', e.target.checked)}
              />
              Featured product
            </label>
          </div>
        </div>

        <div className="form-actions">
          <Link to="/products" className="btn-ghost-sm">Cancel</Link>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isNew ? 'Create product' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
