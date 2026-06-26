import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Star } from 'lucide-react';
import {
  adminGetAllTestimonials, adminCreateTestimonial, adminUpdateTestimonial, adminDeleteTestimonial,
} from '../../api/client';

const emptyForm = { client_name: '', client_title: '', message: '', rating: 5, display_order: 0, is_active: true };

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    adminGetAllTestimonials().then(setTestimonials).finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
  }

  function startEdit(t) {
    setForm({
      client_name: t.client_name, client_title: t.client_title || '', message: t.message,
      rating: t.rating, display_order: t.display_order, is_active: t.is_active,
    });
    setEditingId(t.id);
    setShowForm(true);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await adminUpdateTestimonial(editingId, form);
      } else {
        await adminCreateTestimonial(form);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save testimonial.');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this testimonial?')) return;
    await adminDeleteTestimonial(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy">Testimonials</h1>
          <p className="mt-1 text-sm text-steel-dark">Shown in the slider on the homepage.</p>
        </div>
        <button onClick={startCreate} className="btn-primary"><Plus className="h-4 w-4" /> Add Testimonial</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="panel mt-6 space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Client Name"><input required value={form.client_name} onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))} className="form-input" /></Field>
            <Field label="Client Title / Company"><input value={form.client_title} onChange={(e) => setForm((f) => ({ ...f, client_title: e.target.value }))} className="form-input" /></Field>
          </div>
          <Field label="Message"><textarea required rows={3} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="form-input" /></Field>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Rating (1-5)"><input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))} className="form-input" /></Field>
            <Field label="Display Order"><input type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))} className="form-input" /></Field>
            <label className="mt-7 flex items-center gap-2 text-sm text-steel-dark">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
              Visible on the public site
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" className="btn-primary"><Save className="h-4 w-4" /> {editingId ? 'Save Changes' : 'Create Testimonial'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline border-steel/40 text-navy hover:border-navy">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 space-y-3">
        {loading ? (
          <p className="text-center text-sm text-steel-dark">Loading...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-sm text-steel-dark">No testimonials yet.</p>
        ) : (
          testimonials.map((t) => (
            <div key={t.id} className="panel flex items-start justify-between gap-4 p-5">
              <div>
                <div className="flex items-center gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5" fill={i < t.rating ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <p className="mt-2 text-sm text-steel-dark">&ldquo;{t.message}&rdquo;</p>
                <p className="mt-2 font-mono text-xs text-navy">
                  {t.client_name}{t.client_title ? ` — ${t.client_title}` : ''}
                  {!t.is_active && <span className="ml-2 text-steel-dark">(hidden)</span>}
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <button onClick={() => startEdit(t)} className="text-navy hover:text-accent"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(t.id)} className="text-navy hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))
        )}
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
