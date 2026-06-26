import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Wrench, FolderKanban, Images, Quote,
  FileText, Mail, LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/company', label: 'Company Profile', icon: Building2 },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/gallery', label: 'Gallery', icon: Images },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Quote },
  { to: '/admin/quotes', label: 'Quote Requests', icon: FileText },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="hidden w-64 flex-col bg-navy-deep text-steel-light sm:flex">
        <div className="px-6 py-7">
          <div className="font-display text-base font-bold text-white">
            MHAP <span className="text-accent">ADMIN</span>
          </div>
          <div className="mt-1 font-mono text-xs text-steel-light/60">{admin?.username}</div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map(({ to, label, icon: ItemIcon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-accent text-white' : 'text-steel-light hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <ItemIcon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="mx-3 mb-6 flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-steel-light transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Log Out
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-6 sm:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
