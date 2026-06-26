import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function ProjectCard({ project }) {
  const year = project.project_date ? new Date(project.project_date).getFullYear() : null;

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block overflow-hidden border border-steel/15 bg-white transition-all duration-300 hover:shadow-panel"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-steel-light">
        {project.cover_image_url ? (
          <img
            src={project.cover_image_url}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-xs text-steel-dark">
            NO IMAGE ON FILE
          </div>
        )}
        {project.category && (
          <span className="absolute left-3 top-3 bg-navy/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white">
            {project.category}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-base font-semibold text-navy">{project.title}</h3>
        <div className="mt-2 flex items-center gap-3 font-mono text-xs text-steel-dark">
          {project.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {project.location}
            </span>
          )}
          {year && <span>{year}</span>}
        </div>
      </div>
    </Link>
  );
}
