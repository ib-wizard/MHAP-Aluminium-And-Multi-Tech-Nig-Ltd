import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, User, ArrowLeft } from 'lucide-react';
import { useQuery } from '../hooks/useQuery';
import { getProject, resolveAssetUrl } from '../api/client';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, loading, error } = useQuery(() => getProject(slug), [slug]);

  if (loading) {
    return <p className="container-page py-32 text-center font-mono text-sm text-steel-dark">Loading project...</p>;
  }

  if (error || !project) {
    return (
      <div className="container-page py-32 text-center">
        <p className="font-display text-xl text-navy">Project not found.</p>
        <Link to="/projects" className="mt-4 inline-block text-accent hover:text-accent-dark">
          &larr; Back to all projects
        </Link>
      </div>
    );
  }

  const year = project.project_date ? new Date(project.project_date).getFullYear() : null;

  return (
    <section className="container-page pt-32 pb-24">
      <Link to="/projects" className="inline-flex items-center gap-1 font-mono text-xs text-steel-dark hover:text-accent">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to projects
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          {project.category && (
            <span className="font-mono text-xs uppercase tracking-wider text-accent">{project.category}</span>
          )}
          <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">{project.title}</h1>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-6 font-mono text-sm text-steel-dark">
        {project.client_name && (
          <span className="inline-flex items-center gap-2"><User className="h-4 w-4 text-accent" /> {project.client_name}</span>
        )}
        {project.location && (
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> {project.location}</span>
        )}
        {year && (
          <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" /> {year}</span>
        )}
      </div>

      {project.description && (
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-steel-dark">{project.description}</p>
      )}

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {project.cover_image_url && (
          <img src={resolveAssetUrl(project.cover_image_url)} alt={project.title} className="aspect-[4/3] w-full object-cover" />
        )}
        {(project.images || []).map((img) => (
          <img key={img.id} src={resolveAssetUrl(img.image_url)} alt={img.caption || project.title} className="aspect-[4/3] w-full object-cover" />
        ))}
      </div>

      {!project.cover_image_url && (!project.images || project.images.length === 0) && (
        <p className="mt-12 font-mono text-sm text-steel-dark">No photos uploaded for this project yet.</p>
      )}
    </section>
  );
}
