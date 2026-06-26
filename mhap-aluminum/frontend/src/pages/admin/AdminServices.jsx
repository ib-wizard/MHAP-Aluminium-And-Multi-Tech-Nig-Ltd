import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import {
  adminGetAllServices, adminCreateService, adminUpdateService, adminDeleteService,
} from '../../api/client';
import Icon from '../../components/ui/Icon';

const emptyForm = { title: '', short_description: '', full_description: '', icon: 'layout-grid', display_order: 0, is_active: true };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    adminGetAllServices().then(setServices).finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
  }

  function startEdit(service) {
    setForm({
      title: service.title,
      short_description: service.short_description || '',
      full_description: service.full_description || '',
      icon: service.icon,
      display_order: service.display_order,
      is_active: service.is_active,
    });
    setEditingId(service.id);
    setShowForm(true);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await adminUpdateService(editingId, form);
      } else {
        await adminCreateService(form);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save service.');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this service? This cannot be undone.')) return;
    await adminDeleteService(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy">Services</h1>
          <p className="mt-1 text-sm text-steel-dark">Manage the services shown on the public Services page.</p>
        </div>
        <button onClick={startCreate} className="btn-primary"><Plus className="h-4 w-4" /> Add Service</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="panel mt-6 space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Title">
              <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="form-input" />
            </Field>
            <Field label="Icon name (lucide-react, kebab-case)">
              <div className="flex items-center gap-2">
                <Icon name={form.icon} className="h-5 w-5 text-accent" />
                <input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} placeholder="e.g. door-open" className="form-input" />
              </div>
            </Field>
          </div>
          <Field label="Short Description (used on the homepage card)">
            <textarea rows={2} value={form.short_description} onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))} className="form-input" />
          </Field>
          <Field label="Full Description (used on the Services page)">
            <textarea rows={3} value={form.full_description} onChange={(e) => setForm((f) => ({ ...f, full_description: e.target.value }))} className="form-input" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Display Order">
              <input type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))} className="form-input" />
            </Field>
            <label className="mt-7 flex items-center gap-2 text-sm text-steel-dark">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
              Visible on the public site
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" className="btn-primary"><Save className="h-4 w-4" /> {editingId ? 'Save Changes' : 'Create Service'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline border-steel/40 text-navy hover:border-navy">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 overflow-x-auto border border-steel/15">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy text-white">
            <tr>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Order</th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Service</th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel/15 bg-white">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-steel-dark">Loading...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-steel-dark">No services yet.</td></tr>
            ) : (
              services.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-mono text-xs text-steel-dark">{s.display_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Icon name={s.icon} className="h-4 w-4 text-accent" />
                      <span className="font-medium text-navy">{s.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-xs ${s.is_active ? 'text-green-700' : 'text-steel-dark'}`}>
                      {s.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => startEdit(s)} className="text-navy hover:text-accent"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(s.id)} className="text-navy hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-wider text-steel-dark">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
