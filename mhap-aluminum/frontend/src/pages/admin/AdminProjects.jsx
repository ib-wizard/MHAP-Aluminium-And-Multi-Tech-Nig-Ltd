import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Images, UploadCloud } from 'lucide-react';
import {
  adminGetAllProjects, adminCreateProject, adminUpdateProject, adminDeleteProject,
  adminUploadProjectImages, adminDeleteProjectImage, getProject, resolveAssetUrl,
} from '../../api/client';

const emptyForm = {
  title: '', client_name: '', location: '', category: '', project_date: '',
  description: '', cover_image_url: '', is_featured: false, is_published: true,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [galleryFor, setGalleryFor] = useState(null);

  function load() {
    setLoading(true);
    adminGetAllProjects().then(setProjects).finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
  }

  function startEdit(project) {
    setForm({
      title: project.title,
      client_name: project.client_name || '',
      location: project.location || '',
      category: project.category || '',
      project_date: project.project_date ? project.project_date.slice(0, 10) : '',
      description: project.description || '',
      cover_image_url: project.cover_image_url || '',
      is_featured: project.is_featured,
      is_published: project.is_published,
    });
    setEditingId(project.id);
    setShowForm(true);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await adminUpdateProject(editingId, form);
      } else {
        await adminCreateProject(form);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save project.');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this project and all of its photos? This cannot be undone.')) return;
    await adminDeleteProject(id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy">Projects</h1>
          <p className="mt-1 text-sm text-steel-dark">Manage the projects gallery shown on the public site.</p>
        </div>
        <button onClick={startCreate} className="btn-primary"><Plus className="h-4 w-4" /> Add Project</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="panel mt-6 space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Title"><input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="form-input" /></Field>
            <Field label="Category"><input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="e.g. Curtain Wall Systems" className="form-input" /></Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Client Name"><input value={form.client_name} onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))} className="form-input" /></Field>
            <Field label="Location"><input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="form-input" /></Field>
            <Field label="Date"><input type="date" value={form.project_date} onChange={(e) => setForm((f) => ({ ...f, project_date: e.target.value }))} className="form-input" /></Field>
          </div>
          <Field label="Description"><textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="form-input" /></Field>
          <Field label="Cover Image URL (or upload photos from the gallery panel after saving)">
            <input value={form.cover_image_url} onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))} className="form-input" />
          </Field>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-steel-dark">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} />
              Featured on homepage
            </label>
            <label className="flex items-center gap-2 text-sm text-steel-dark">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))} />
              Published (visible to the public)
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button type="submit" className="btn-primary"><Save className="h-4 w-4" /> {editingId ? 'Save Changes' : 'Create Project'}</button>
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
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Project</th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel/15 bg-white">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-steel-dark">Loading...</td></tr>
            ) : projects.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-steel-dark">No projects yet.</td></tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-navy">{p.title}</td>
                  <td className="px-4 py-3 text-steel-dark">{p.category || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-xs ${p.is_published ? 'text-green-700' : 'text-steel-dark'}`}>
                      {p.is_published ? 'Published' : 'Draft'}{p.is_featured ? ' · Featured' : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => setGalleryFor(p)} title="Manage photos" className="text-navy hover:text-accent"><Images className="h-4 w-4" /></button>
                      <button onClick={() => startEdit(p)} className="text-navy hover:text-accent"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="text-navy hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {galleryFor && <ProjectGalleryModal project={galleryFor} onClose={() => setGalleryFor(null)} />}
    </div>
  );
}

function ProjectGalleryModal({ project, onClose }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  function load() {
    setLoading(true);
    getProject(project.slug).then((data) => setImages(data.images || [])).finally(() => setLoading(false));
  }

  useEffect(load, [project.slug]);

  async function handleUpload(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      await adminUploadProjectImages(project.id, files);
      load();
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleDelete(imageId) {
    await adminDeleteProjectImage(imageId);
    load();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-navy">Photos — {project.title}</h2>
          <button onClick={onClose} className="text-steel-dark hover:text-navy"><X className="h-5 w-5" /></button>
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-3 border border-dashed border-steel/40 px-4 py-4 text-sm text-steel-dark hover:border-accent">
          <UploadCloud className="h-5 w-5 text-accent" />
          {uploading ? 'Uploading...' : 'Click to upload one or more photos'}
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {loading ? (
            <p className="col-span-3 text-center text-sm text-steel-dark">Loading photos...</p>
          ) : images.length === 0 ? (
            <p className="col-span-3 text-center text-sm text-steel-dark">No photos uploaded yet.</p>
          ) : (
            images.map((img) => (
              <div key={img.id} className="group relative aspect-square overflow-hidden">
                <img src={resolveAssetUrl(img.image_url)} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => handleDelete(img.id)}
                  className="absolute right-1 top-1 hidden rounded-full bg-red-600 p-1 text-white group-hover:block"
                  title="Delete photo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
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
