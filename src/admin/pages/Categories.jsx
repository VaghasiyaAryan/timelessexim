import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { useToast } from '../../lib/toast-context.jsx';

export default function Categories() {
  const [categories, setCategories] = useState(null);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function load() {
    const d = await api.get('/categories');
    setCategories(d.categories);
  }

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setBusy(true);
    try {
      const d = await api.post('/categories', { name: newName.trim() });
      setCategories(d.categories);
      setNewName('');
      toast.success('Category added.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  function startEdit(c) {
    setEditingId(c.id);
    setEditingName(c.name);
  }

  async function saveEdit(id) {
    if (!editingName.trim()) return;
    try {
      const d = await api.put(`/categories/${id}`, { name: editingName.trim() });
      setCategories(d.categories);
      setEditingId(null);
      toast.success('Category updated.');
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete(c) {
    const msg =
      c.product_count > 0
        ? `"${c.name}" has ${c.product_count} product(s). Deleting it will leave them uncategorised. Continue?`
        : `Delete "${c.name}"?`;
    if (!confirm(msg)) return;
    try {
      const d = await api.del(`/categories/${c.id}`);
      setCategories(d.categories);
      toast.success('Category deleted.');
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="page page-narrow">
      <div className="page-head">
        <h1>Categories</h1>
        <p>Used to organise products on the public site.</p>
      </div>

      <form className="card inline-form" onSubmit={handleCreate}>
        <input
          placeholder="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={busy}>Add category</button>
      </form>

      {categories === null ? (
        <div className="admin-loading-inline">Loading categories…</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Products</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    {editingId === c.id ? (
                      <input
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(c.id)}
                      />
                    ) : (
                      c.name
                    )}
                  </td>
                  <td>{c.product_count}</td>
                  <td className="cell-actions">
                    {editingId === c.id ? (
                      <>
                        <button className="btn-ghost-sm" onClick={() => saveEdit(c.id)}>Save</button>
                        <button className="btn-ghost-sm" onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn-ghost-sm" onClick={() => startEdit(c)}>Rename</button>
                        <button className="btn-ghost-sm danger" onClick={() => handleDelete(c)}>Delete</button>
                      </>
                    )}
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
