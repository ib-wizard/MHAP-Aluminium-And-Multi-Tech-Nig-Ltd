import { useEffect, useState } from 'react';
import { UploadCloud, Save } from 'lucide-react';
import { getCompany, adminUpdateCompany, adminUploadBranding, adminChangePassword } from '../../api/client';

const emptyForm = {
  company_name: '', slogan: '', logo_url: '', about_text: '', mission: '', vision: '',
  core_values: '', hero_heading: '', hero_subheading: '', hero_image_url: '', banner_image_url: '',
  stat_projects_completed: 0, stat_happy_clients: 0, stat_years_experience: 0, stat_team_size: 0,
  phone: '', whatsapp: '', email: '', address: '', map_embed_url: '',
  facebook_url: '', instagram_url: '', tiktok_url: '', linkedin_url: '',
  primary_color: '#0B1F3A', secondary_color: '#8B9299', accent_color: '#2D6CDF',
};

export default function AdminCompany() {
  const [form, setForm] = useState(emptyForm);
  const [valuesText, setValuesText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [uploading, setUploading] = useState('');

  useEffect(() => {
    getCompany().then((data) => {
      setForm({ ...emptyForm, ...data });
      try {
        setValuesText((JSON.parse(data.core_values || '[]')).join(', '));
      } catch {
        setValuesText('');
      }
      setLoading(false);
    });
  }, []);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleUpload(field, file) {
    if (!file) return;
    setUploading(field);
    try {
      const { url } = await adminUploadBranding(file);
      setForm((f) => ({ ...f, [field]: url }));
    } finally {
      setUploading('');
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        core_values: JSON.stringify(valuesText.split(',').map((v) => v.trim()).filter(Boolean)),
      };
      await adminUpdateCompany(payload);
      setSavedAt(new Date());
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="font-mono text-sm text-steel-dark">Loading company profile...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy">Company Profile</h1>
      <p className="mt-1 text-sm text-steel-dark">
        These fields power the homepage, about page, footer and contact details across the whole site.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-10">
        <FormSection title="Identity">
          <Row>
            <Field label="Company Name"><input value={form.company_name} onChange={update('company_name')} className="form-input" /></Field>
            <Field label="Slogan"><input value={form.slogan} onChange={update('slogan')} className="form-input" /></Field>
          </Row>
          <ImageField label="Logo" url={form.logo_url} uploading={uploading === 'logo_url'} onFile={(f) => handleUpload('logo_url', f)} />
        </FormSection>

        <FormSection title="About Page">
          <Field label="About Text"><textarea rows={4} value={form.about_text} onChange={update('about_text')} className="form-input" /></Field>
          <Row>
            <Field label="Mission"><textarea rows={3} value={form.mission} onChange={update('mission')} className="form-input" /></Field>
            <Field label="Vision"><textarea rows={3} value={form.vision} onChange={update('vision')} className="form-input" /></Field>
          </Row>
          <Field label="Core Values (comma-separated)">
            <input value={valuesText} onChange={(e) => setValuesText(e.target.value)} placeholder="Precision, Integrity, Innovation" className="form-input" />
          </Field>
        </FormSection>

        <FormSection title="Homepage Hero">
          <Field label="Hero Heading"><input value={form.hero_heading} onChange={update('hero_heading')} className="form-input" /></Field>
          <Field label="Hero Subheading"><textarea rows={2} value={form.hero_subheading} onChange={update('hero_subheading')} className="form-input" /></Field>
          <Row>
            <ImageField label="Hero Background" url={form.hero_image_url} uploading={uploading === 'hero_image_url'} onFile={(f) => handleUpload('hero_image_url', f)} />
            <ImageField label="Homepage Banner" url={form.banner_image_url} uploading={uploading === 'banner_image_url'} onFile={(f) => handleUpload('banner_image_url', f)} />
          </Row>
        </FormSection>

        <FormSection title="Stats Counters">
          <Row cols={4}>
            <Field label="Projects Completed"><input type="number" value={form.stat_projects_completed} onChange={update('stat_projects_completed')} className="form-input" /></Field>
            <Field label="Happy Clients"><input type="number" value={form.stat_happy_clients} onChange={update('stat_happy_clients')} className="form-input" /></Field>
            <Field label="Years of Experience"><input type="number" value={form.stat_years_experience} onChange={update('stat_years_experience')} className="form-input" /></Field>
            <Field label="Team Size"><input type="number" value={form.stat_team_size} onChange={update('stat_team_size')} className="form-input" /></Field>
          </Row>
        </FormSection>

        <FormSection title="Contact Information">
          <Row>
            <Field label="Phone"><input value={form.phone} onChange={update('phone')} className="form-input" /></Field>
            <Field label="WhatsApp"><input value={form.whatsapp} onChange={update('whatsapp')} className="form-input" /></Field>
          </Row>
          <Row>
            <Field label="Email"><input type="email" value={form.email} onChange={update('email')} className="form-input" /></Field>
            <Field label="Address"><input value={form.address} onChange={update('address')} className="form-input" /></Field>
          </Row>
          <Field label="Google Map Embed URL">
            <input value={form.map_embed_url} onChange={update('map_embed_url')} placeholder="https://www.google.com/maps/embed?..." className="form-input" />
          </Field>
        </FormSection>

        <FormSection title="Social Media">
          <Row cols={4}>
            <Field label="Facebook"><input value={form.facebook_url} onChange={update('facebook_url')} className="form-input" /></Field>
            <Field label="Instagram"><input value={form.instagram_url} onChange={update('instagram_url')} className="form-input" /></Field>
            <Field label="TikTok"><input value={form.tiktok_url} onChange={update('tiktok_url')} className="form-input" /></Field>
            <Field label="LinkedIn"><input value={form.linkedin_url} onChange={update('linkedin_url')} className="form-input" /></Field>
          </Row>
        </FormSection>

        <FormSection title="Brand Colors">
          <Row cols={3}>
            <ColorField label="Primary (Navy)" value={form.primary_color} onChange={update('primary_color')} />
            <ColorField label="Secondary (Steel)" value={form.secondary_color} onChange={update('secondary_color')} />
            <ColorField label="Accent" value={form.accent_color} onChange={update('accent_color')} />
          </Row>
          <p className="font-mono text-xs text-steel-dark">
            Stored for reference and for any custom theming you wire up — the live site's Tailwind palette is set in
            <code className="mx-1">frontend/tailwind.config.js</code>.
          </p>
        </FormSection>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {savedAt && <span className="font-mono text-xs text-steel-dark">Saved at {savedAt.toLocaleTimeString()}</span>}
        </div>
      </form>

      <ChangePasswordForm />
    </div>
  );
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await adminChangePassword({ currentPassword, newPassword });
      setMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update password.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-12 panel max-w-md space-y-4 p-6">
      <h2 className="font-display text-base font-semibold text-navy">Change Your Password</h2>
      <Field label="Current Password"><input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="form-input" /></Field>
      <Field label="New Password (min 8 characters)"><input type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-input" /></Field>
      {message && <p className="text-sm text-green-700">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" className="btn-dark">Update Password</button>
    </form>
  );
}

function FormSection({ title, children }) {
  return (
    <div className="panel space-y-5 p-6">
      <h2 className="font-display text-base font-semibold text-navy">{title}</h2>
      {children}
    </div>
  );
}

function Row({ children, cols = 2 }) {
  const colsClass = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4' }[cols] || 'sm:grid-cols-2';
  return <div className={`grid gap-5 ${colsClass}`}>{children}</div>;
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-wider text-steel-dark">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <input type="color" value={value} onChange={onChange} className="h-10 w-12 cursor-pointer border border-steel/30" />
        <input value={value} onChange={onChange} className="form-input" />
      </div>
    </Field>
  );
}

function ImageField({ label, url, uploading, onFile }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-4">
        {url ? (
          <img src={url} alt={label} className="h-16 w-16 object-cover" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center bg-steel-light/40 font-mono text-[10px] text-steel-dark">NONE</div>
        )}
        <label className="flex cursor-pointer items-center gap-2 border border-dashed border-steel/40 px-4 py-2.5 text-sm text-steel-dark hover:border-accent">
          <UploadCloud className="h-4 w-4 text-accent" />
          {uploading ? 'Uploading...' : 'Upload image'}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
      </div>
    </Field>
  );
}
