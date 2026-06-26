import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (admin) {
    navigate(location.state?.from?.pathname || '/admin', { replace: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center blueprint-bg px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-white/10 bg-navy-deep/80 p-8 backdrop-blur">
        <div className="flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center bg-accent text-white">
            <Lock className="h-5 w-5" />
          </span>
        </div>
        <h1 className="mt-5 text-center font-display text-xl font-semibold text-white">MHAP Admin</h1>
        <p className="mt-1 text-center font-mono text-xs text-steel-light/70">Staff sign in</p>

        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-wider text-steel-light/80">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-wider text-steel-light/80">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-accent"
            />
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-8 w-full disabled:opacity-60">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
