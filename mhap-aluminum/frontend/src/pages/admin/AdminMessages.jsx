import { useEffect, useState } from 'react';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import { adminGetMessages, adminMarkMessageRead, adminDeleteMessage } from '../../api/client';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    adminGetMessages().then(setMessages).finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleMarkRead(id) {
    await adminMarkMessageRead(id);
    load();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this message?')) return;
    await adminDeleteMessage(id);
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-navy">Contact Messages</h1>
      <p className="mt-1 text-sm text-steel-dark">Submissions from the public Contact Us form.</p>

      <div className="mt-8 space-y-3">
        {loading ? (
          <p className="text-center text-sm text-steel-dark">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-steel-dark">No messages yet.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`panel p-5 ${!m.is_read ? 'border-l-4 border-l-accent' : ''}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-base font-semibold text-navy">
                    {m.subject || 'No subject'}
                  </h3>
                  <p className="font-mono text-xs text-steel-dark">
                    {m.name} · {m.email} {m.phone ? `· ${m.phone}` : ''} · {new Date(m.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleMarkRead(m.id)}
                    disabled={m.is_read}
                    title={m.is_read ? 'Already read' : 'Mark as read'}
                    className="text-navy hover:text-accent disabled:opacity-40"
                  >
                    {m.is_read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="text-navy hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="mt-3 text-sm text-steel-dark">{m.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
