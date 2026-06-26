import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { submitQuoteRequest } from '../api/client';
import ExtrusionDivider from '../components/ui/ExtrusionDivider';

const initialForm = { name: '', phone: '', email: '', project_type: '', description: '', budget: '' };

export default function QuoteRequest() {
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      if (file) fd.append('attachment', file);
      await submitQuoteRequest(fd);
      setStatus('sent');
      setForm(initialForm);
      setFile(null);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'sent') {
    return (
      <section className="container-page flex min-h-screen flex-col items-center justify-center pt-32 text-center">
        <h1 className="font-display text-3xl font-semibold text-navy">Request received.</h1>
        <p className="mt-4 max-w-md text-steel-dark">
          Thank you — our team will review your project details and contact you shortly with a quotation.
        </p>
        <button onClick={() => setStatus('idle')} className="btn-dark mt-8">
          Submit another request
        </button>
      </section>
    );
  }

  return (
    <>
      <section className="blueprint-bg pt-32 pb-16">
        <div className="container-page">
          <span className="eyebrow">Quote Request</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold text-white sm:text-5xl">
            Tell us about your project.
          </h1>
          <p className="mt-5 max-w-xl text-steel-light">
            Share a few details and, if you have one, a drawing or reference photo — we'll get back to you with a
            detailed quotation.
          </p>
        </div>
      </section>

      <ExtrusionDivider tone="dark" />

      <section className="container-page py-20">
        <form onSubmit={handleSubmit} className="panel mx-auto max-w-2xl space-y-5 p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name" required>
              <input required value={form.name} onChange={update('name')} className="form-input" />
            </Field>
            <Field label="Phone Number" required>
              <input required value={form.phone} onChange={update('phone')} className="form-input" />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email">
              <input type="email" value={form.email} onChange={update('email')} className="form-input" />
            </Field>
            <Field label="Project Type">
              <input
                value={form.project_type}
                onChange={update('project_type')}
                placeholder="e.g. Sliding Windows, Curtain Wall"
                className="form-input"
              />
            </Field>
          </div>
          <Field label="Project Description" required>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={update('description')}
              placeholder="Describe the project: location, size, materials, timeline..."
              className="form-input"
            />
          </Field>
          <Field label="Estimated Budget (optional)">
            <input value={form.budget} onChange={update('budget')} placeholder="e.g. ₦500,000 - ₦1,000,000" className="form-input" />
          </Field>

          <Field label="Upload Drawing or Image (optional)">
            <label className="flex cursor-pointer items-center gap-3 border border-dashed border-steel/40 px-4 py-4 text-sm text-steel-dark hover:border-accent">
              <UploadCloud className="h-5 w-5 text-accent" />
              {file ? file.name : 'Click to attach a JPG, PNG or PDF (max 8MB)'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </Field>

          {status === 'error' && <p className="text-sm text-red-600">{errorMsg}</p>}

          <button type="submit" disabled={status === 'sending'} className="btn-primary w-full disabled:opacity-60">
            {status === 'sending' ? 'Submitting...' : 'Submit Quote Request'}
          </button>
        </form>
      </section>
    </>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-wider text-steel-dark">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
