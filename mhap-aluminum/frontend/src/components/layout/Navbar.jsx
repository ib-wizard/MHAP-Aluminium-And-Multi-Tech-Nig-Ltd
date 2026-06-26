import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { getCompany } from '../../api/client';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: company } = useQuery(getCompany, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy-deep/95 shadow-md backdrop-blur' : 'bg-transparent'
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-bold tracking-wide text-white">
            MHAP <span className="text-accent">ALUMINUM</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `font-display text-sm tracking-wide transition-colors ${
                  isActive ? 'text-accent' : 'text-steel-light hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          {company?.phone && (
            <a
              href={`tel:${company.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 font-mono text-xs text-steel-light"
            >
              <Phone className="h-3.5 w-3.5 text-accent" /> {company.phone}
            </a>
          )}
          <Link to="/quote" className="btn-primary">
            Get a Quote
          </Link>
        </div>

        <button
          className="text-white lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-navy-deep lg:hidden">
          <div className="container-page flex flex-col gap-4 py-6">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `font-display text-base ${isActive ? 'text-accent' : 'text-steel-light'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/quote" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
