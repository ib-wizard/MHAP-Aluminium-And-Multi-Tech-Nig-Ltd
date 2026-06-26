import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="container-page flex min-h-screen flex-col items-center justify-center pt-20 text-center">
      <span className="font-mono text-sm text-steel-dark">ERROR 404</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-navy">Page not found.</h1>
      <p className="mt-3 max-w-md text-steel-dark">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-dark mt-8">
        Back to Home
      </Link>
    </section>
  );
}
