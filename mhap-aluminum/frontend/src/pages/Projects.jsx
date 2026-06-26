import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getProjects, getProjectCategories } from '../api/client';
import ProjectCard from '../components/ui/ProjectCard';
import ExtrusionDivider from '../components/ui/ExtrusionDivider';

export default function Projects() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 9;

  useEffect(() => {
    getProjectCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      getProjects({ category: activeCategory || undefined, search: search || undefined, page, pageSize })
        .then((res) => {
          setItems(res.items);
          setTotal(res.total);
        })
        .finally(() => setLoading(false));
    }, 300); // debounce search typing
    return () => clearTimeout(timeout);
  }, [activeCategory, search, page]);

  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  return (
    <>
      <section className="blueprint-bg pt-32 pb-16">
        <div className="container-page">
          <span className="eyebrow">Our Work</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold text-white sm:text-5xl">
            Projects Gallery
          </h1>
          <p className="mt-5 max-w-2xl text-steel-light">
            A record of installations across Gombe State and beyond — filter by category or search by client and
            location.
          </p>
        </div>
      </section>

      <ExtrusionDivider tone="dark" />

      <section className="container-page py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setActiveCategory('');
                setPage(1);
              }}
              className={`border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                activeCategory === '' ? 'border-accent bg-accent text-white' : 'border-steel/30 text-steel-dark hover:border-accent'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setPage(1);
                }}
                className={`border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                  activeCategory === cat ? 'border-accent bg-accent text-white' : 'border-steel/30 text-steel-dark hover:border-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-dark" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search projects, clients, location..."
              className="w-full border border-steel/30 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="mt-10">
          {loading ? (
            <p className="text-center font-mono text-sm text-steel-dark">Loading projects...</p>
          ) : items.length === 0 ? (
            <p className="text-center font-mono text-sm text-steel-dark">No projects match your filters yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-9 w-9 font-mono text-sm ${
                  page === i + 1 ? 'bg-navy text-white' : 'border border-steel/30 text-steel-dark hover:border-accent'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
