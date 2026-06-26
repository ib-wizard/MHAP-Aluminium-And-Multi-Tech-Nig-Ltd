import * as Icons from 'lucide-react';

function toPascalCase(kebab) {
  return kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Renders a lucide-react icon from a kebab-case name stored in the
 * database (e.g. services.icon = "panels-top-left"), falling back to a
 * generic icon if the name doesn't match a known component.
 */
export default function Icon({ name, className = 'h-6 w-6', ...rest }) {
  const ComponentName = toPascalCase(name || 'layout-grid');
  const LucideIcon = Icons[ComponentName] || Icons.LayoutGrid;
  return <LucideIcon className={className} {...rest} />;
}
