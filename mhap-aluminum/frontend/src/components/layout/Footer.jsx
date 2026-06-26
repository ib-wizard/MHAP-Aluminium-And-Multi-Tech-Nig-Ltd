import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { getCompany, getServices } from '../../api/client';
import ExtrusionDivider from '../ui/ExtrusionDivider';

// lucide-react has no TikTok icon; this is a small inline glyph instead.
function TikTokGlyph(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-3.07-2.6V3h-3.4v12.2a2.45 2.45 0 1 1-1.73-2.34V9.42a5.85 5.85 0 1 0 5.13 5.8V9.66a7.65 7.65 0 0 0 4.47 1.43V7.66a4.27 4.27 0 0 1-1.4-1.84z" />
    </svg>
  );
}

export default function Footer() {
  const { data: company } = useQuery(getCompany, []);
  const { data: services } = useQuery(getServices, []);
  const year = new Date().getFullYear();

  return (
    <footer className="blueprint-bg text-steel-light">
      <ExtrusionDivider />
      <div className="container-page grid gap-12 py-16 lg:grid-cols-4">
        <div>
          <div className="font-display text-lg font-bold text-white">
            MHAP <span className="text-accent">ALUMINUM</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-steel-light/80">
            {company?.slogan || 'Crafting Quality, Shaping Excellence.'}
          </p>
          <div className="mt-6 flex gap-3">
            {company?.facebook_url && (
              <a href={company.facebook_url} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 p-2 hover:border-accent hover:text-accent">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {company?.instagram_url && (
              <a href={company.instagram_url} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 p-2 hover:border-accent hover:text-accent">
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {company?.tiktok_url && (
              <a href={company.tiktok_url} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 p-2 hover:border-accent hover:text-accent">
                <TikTokGlyph className="h-4 w-4" />
              </a>
            )}
            {company?.linkedin_url && (
              <a href={company.linkedin_url} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 p-2 hover:border-accent hover:text-accent">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="eyebrow">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/services" className="hover:text-white">Services</Link></li>
            <li><Link to="/projects" className="hover:text-white">Projects</Link></li>
            <li><Link to="/quote" className="hover:text-white">Request a Quote</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow">Services</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {(services || []).slice(0, 5).map((s) => (
              <li key={s.id}>
                <Link to={`/services#${s.slug}`} className="hover:text-white">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm">
            {company?.address && (
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {company.address}</li>
            )}
            {company?.phone && (
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-accent" /> {company.phone}</li>
            )}
            {company?.email && (
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-accent" /> {company.email}</li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-steel-light/70 sm:flex-row">
          <span>
            &copy; {year} {company?.company_name || 'MHAP Aluminum and Multitech Nigeria Limited'}. All rights reserved.
          </span>
          <Link to="/admin/login" className="hover:text-white">Staff Login</Link>
        </div>
      </div>
    </footer>
  );
}
