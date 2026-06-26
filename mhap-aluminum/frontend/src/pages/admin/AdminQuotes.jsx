import { useEffect, useState } from 'react';
import { Trash2, FileDown } from 'lucide-react';
import { adminGetQuotes, adminUpdateQuoteStatus, adminDeleteQuote } from '../../api/client';

const statuses = ['pending', 'reviewing', 'quoted', 'completed', 'declined'];
const statusColors = {
  pending: 'text-amber-700', reviewing: 'text-accent', quoted: 'text-navy',
  completed: 'text-green-700', declined: 'text-red-600',
};

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  function load() {
    setLoading(true);
    adminGetQuotes(filter || undefined).then(setQuotes).finally(() => setLoading(false));
  }

  useEffect(load, [filter]);

  async function handleStatusChange(id, status) {
    await adminUpdateQuoteStatus(id, status);
    load();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this quote request?')) return;
    await adminDeleteQuote(id);
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy">Quote Requests</h1>
          <p className="mt-1 text-sm text-steel-dark">Submissions from the public "Request a Quote" form.</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="form-input w-44">
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="text-center text-sm text-steel-dark">Loading...</p>
        ) : quotes.length === 0 ? (
          <p className="text-center text-sm text-steel-dark">No quote requests yet.</p>
        ) : (
          quotes.map((q) => (
            <div key={q.id} className="panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-base font-semibold text-navy">{q.name}</h3>
                  <p className="font-mono text-xs text-steel-dark">
                    {q.phone} {q.email ? `· ${q.email}` : ''} · {new Date(q.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={q.status}
                    onChange={(e) => handleStatusChange(q.id, e.target.value)}
                    className={`form-input w-36 font-mono text-xs ${statusColors[q.status]}`}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button onClick={() => handleDelete(q.id)} className="text-navy hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>

              {q.project_type && <p className="mt-3 font-mono text-xs uppercase tracking-wider text-accent">{q.project_type}</p>}
              <p className="mt-2 text-sm text-steel-dark">{q.description}</p>
              {q.budget && <p className="mt-2 text-xs text-steel-dark">Budget: {q.budget}</p>}
              {q.attachment_url && (
                <a href={q.attachment_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-accent hover:text-accent-dark">
                  <FileDown className="h-3.5 w-3.5" /> View attachment
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
