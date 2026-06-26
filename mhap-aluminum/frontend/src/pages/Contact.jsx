import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useQuery } from '../hooks/useQuery';
import { getCompany, submitContactMessage } from '../api/client';
import ExtrusionDivider from '../components/ui/ExtrusionDivider';

const initialForm = { name: '', email: '', phone: '', subject: '', message: '' };

export default function Contact() {
  const { data: company } = useQuery(getCompany, []);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      await submitContactMessage(form);
      setStatus('sent');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  }

  const whatsappLink = company?.whatsapp
    ? `https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}`
    : null;

  return (
    <>
      <section className="blueprint-bg pt-32 pb-16">
        <div className="container-page">
          <span className="eyebrow">Get In Touch</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold text-white sm:text-5xl">Contact Us</h1>
        </div>
      </section>

      <ExtrusionDivider tone="dark" />

      <section className="container-page py-20">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-semibold text-navy">Reach our team directly</h2>
            <ul className="mt-6 space-y-5">
              {company?.phone && (
                <li className="flex items-center gap-3 text-steel-dark">
                  <span className="flex h-10 w-10 items-center justify-center bg-navy text-white"><Phone className="h-4 w-4" /></span>
                  <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="hover:text-accent">{company.phone}</a>
                </li>
              )}
              {whatsappLink && (
                <li className="flex items-center gap-3 text-steel-dark">
                  <span className="flex h-10 w-10 items-center justify-center bg-navy text-white"><MessageCircle className="h-4 w-4" /></span>
                  <a href={whatsappLink} target="_blank" rel="noreferrer" className="hover:text-accent">WhatsApp: {company.whatsapp}</a>
                </li>
              )}
              {company?.email && (
                <li className="flex items-center gap-3 text-steel-dark">
                  <span className="flex h-10 w-10 items-center justify-center bg-navy text-white"><Mail className="h-4 w-4" /></span>
                  <a href={`mailto:${company.email}`} className="hover:text-accent">{company.email}</a>
                </li>
              )}
              {company?.address && (
                <li className="flex items-center gap-3 text-steel-dark">
                  <span className="flex h-10 w-10 items-center justify-center bg-navy text-white"><MapPin className="h-4 w-4" /></span>
                  {company.address}
                </li>
              )}
            </ul>

            <div className="mt-8 flex gap-3">
              {company?.facebook_url && (
                <a href={company.facebook_url} target="_blank" rel="noreferrer" className="rounded-full border border-steel/30 p-2.5 text-navy hover:border-accent hover:text-accent">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {company?.instagram_url && (
                <a href={company.instagram_url} target="_blank" rel="noreferrer" className="rounded-full border border-steel/30 p-2.5 text-navy hover:border-accent hover:text-accent">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {company?.linkedin_url && (
                <a href={company.linkedin_url} target="_blank" rel="noreferrer" className="rounded-full border border-steel/30 p-2.5 text-navy hover:border-accent hover:text-accent">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
            </div>

            <div className="mt-10 aspect-video w-full overflow-hidden border border-steel/15 bg-steel-light/40">
              {company?.map_embed_url ? (
                <iframe
                  title="MHAP Aluminum location"
                  src={company.map_embed_url}
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex h-full items-center justify-center font-mono text-xs text-steel-dark">
                  Map link not configured yet — add one from the admin dashboard.
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="panel space-y-5 p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full Name" required>
                <input required value={form.name} onChange={update('name')} className="form-input" />
              </Field>
              <Field label="Email" required>
                <input required type="email" value={form.email} onChange={update('email')} className="form-input" />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Phone">
                <input value={form.phone} onChange={update('phone')} className="form-input" />
              </Field>
              <Field label="Subject">
                <input value={form.subject} onChange={update('subject')} className="form-input" />
              </Field>
            </div>
            <Field label="Message" required>
              <textarea required rows={5} value={form.message} onChange={update('message')} className="form-input" />
            </Field>

            {status === 'sent' && (
              <p className="text-sm text-green-700">Message sent — we will get back to you shortly.</p>
            )}
            {status === 'error' && <p className="text-sm text-red-600">{errorMsg}</p>}

            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full disabled:opacity-60">
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
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
