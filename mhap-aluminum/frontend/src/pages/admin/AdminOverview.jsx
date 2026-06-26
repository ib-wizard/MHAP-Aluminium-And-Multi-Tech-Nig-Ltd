import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Wrench, FileText, Mail } from 'lucide-react';
import {
  adminGetAllProjects, adminGetAllServices, adminGetQuotes, adminGetMessages,
} from '../../api/client';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([adminGetAllProjects(), adminGetAllServices(), adminGetQuotes(), adminGetMessages()]).then(
      ([projects, services, quotes, messages]) => {
        setStats({
          projects: projects.length,
          services: services.length,
          pendingQuotes: quotes.filter((q) => q.status === 'pending').length,
          unreadMessages: messages.filter((m) => !m.is_read).length,
        });
      }
    );
  }, []);

  const cards = [
    { label: 'Projects', value: stats?.projects, icon: FolderKanban, to: '/admin/projects' },
    { label: 'Services', value: stats?.services, icon: Wrench, to: '/admin/services' },
    { label: 'Pending Quotes', value: stats?.pendingQuotes, icon: FileText, to: '/admin/quotes' },
    { label: 'Unread Messages', value: stats?.unreadMessages, icon: Mail, to: '/admin/messages' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy">Dashboard Overview</h1>
      <p className="mt-1 text-sm text-steel-dark">A quick look at site activity.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: ItemIcon, to }) => (
          <Link key={label} to={to} className="panel flex flex-col gap-3 p-6 transition-transform hover:-translate-y-0.5">
            <ItemIcon className="h-6 w-6 text-accent" />
            <div className="font-display text-3xl font-semibold text-navy">{value ?? '—'}</div>
            <div className="font-mono text-xs uppercase tracking-wider text-steel-dark">{label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 panel p-6">
        <h2 className="font-display text-base font-semibold text-navy">Getting started</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-steel-dark">
          <li>Update your company details, hero text and logo under <strong>Company Profile</strong>.</li>
          <li>Add or edit services under <strong>Services</strong> — these populate the public Services page.</li>
          <li>Create projects and upload site photos under <strong>Projects</strong>.</li>
          <li>Review incoming <strong>Quote Requests</strong> and <strong>Messages</strong> regularly.</li>
        </ul>
      </div>
    </div>
  );
}
