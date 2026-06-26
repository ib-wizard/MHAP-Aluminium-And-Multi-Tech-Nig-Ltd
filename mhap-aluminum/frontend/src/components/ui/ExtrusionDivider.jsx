/**
 * Signature element: a repeating aluminum extrusion cross-section profile,
 * the kind of line-drawing you'd find on a fabrication shop's cut sheet.
 * Used as a section divider so the "engineering precision" brief shows up
 * in the page's structure, not just its copy.
 */
export default function ExtrusionDivider({ className = '', tone = 'light' }) {
  const stroke = tone === 'light' ? '#C8CDD3' : '#0B1F3A';

  return (
    <div className={`select-none overflow-hidden ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 240 24"
        preserveAspectRatio="none"
        className="h-6 w-full"
      >
        <defs>
          <pattern id="extrusion-profile" width="40" height="24" patternUnits="userSpaceOnUse">
            {/* outer frame */}
            <rect x="2" y="4" width="36" height="16" rx="1.5" fill="none" stroke={stroke} strokeWidth="1" opacity="0.55" />
            {/* hollow chamber */}
            <rect x="7" y="8" width="10" height="8" rx="1" fill="none" stroke={stroke} strokeWidth="1" opacity="0.4" />
            {/* glazing channel */}
            <line x1="21" y1="7" x2="21" y2="17" stroke={stroke} strokeWidth="1" opacity="0.4" />
            {/* fixing screw point */}
            <circle cx="32" cy="12" r="1.4" fill={stroke} opacity="0.5" />
          </pattern>
        </defs>
        <rect width="240" height="24" fill="url(#extrusion-profile)" />
      </svg>
    </div>
  );
}
