import { useEffect, useState } from 'react';
import { Trash2, UploadCloud } from 'lucide-react';
import { getGallery, adminUploadGalleryImages, adminDeleteGalleryImage, resolveAssetUrl } from '../../api/client';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  function load() {
    setLoading(true);
    getGallery().then(setImages).finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleUpload(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      await adminUploadGalleryImages(files, title, category);
      setTitle('');
      setCategory('');
      load();
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this image?')) return;
    await adminDeleteGalleryImage(id);
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy">Gallery</h1>
      <p className="mt-1 text-sm text-steel-dark">
        General-purpose photos, independent of a specific project (useful for workshop shots, materials, team photos).
      </p>

      <div className="panel mt-6 space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional, applies to this batch)" className="form-input" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category (optional)" className="form-input" />
        </div>
        <label className="flex cursor-pointer items-center gap-3 border border-dashed border-steel/40 px-4 py-4 text-sm text-steel-dark hover:border-accent">
          <UploadCloud className="h-5 w-5 text-accent" />
          {uploading ? 'Uploading...' : 'Click to upload one or more images'}
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {loading ? (
          <p className="col-span-full text-center text-sm text-steel-dark">Loading...</p>
        ) : images.length === 0 ? (
          <p className="col-span-full text-center text-sm text-steel-dark">No gallery images yet.</p>
        ) : (
          images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden border border-steel/15">
              <img src={resolveAssetUrl(img.image_url)} alt={img.title || ''} className="h-full w-full object-cover" />
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute right-1 top-1 hidden rounded-full bg-red-600 p-1 text-white group-hover:block"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
