import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Icon from './Icon';

export default function ServiceCard({ service, index }) {
  return (
    <div className="group relative flex flex-col gap-4 border border-steel/15 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-panel">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.18em] text-steel-dark">
          SPEC&nbsp;{String(index + 1).padStart(2, '0')}
        </span>
        <Icon name={service.icon} className="h-7 w-7 text-accent" />
      </div>
      <h3 className="font-display text-lg font-semibold text-navy">{service.title}</h3>
      <p className="flex-1 text-sm leading-relaxed text-steel-dark">{service.short_description}</p>
      <Link
        to={`/services#${service.slug}`}
        className="inline-flex items-center gap-1 font-display text-sm font-medium text-accent transition-colors group-hover:text-accent-dark"
      >
        Learn more <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
