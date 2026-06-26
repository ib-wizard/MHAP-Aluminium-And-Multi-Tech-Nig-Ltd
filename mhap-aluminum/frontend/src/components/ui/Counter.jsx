import { useEffect, useRef, useState } from 'react';

/**
 * Animated count-up that triggers once the element scrolls into view.
 * Used for the homepage stats strip (projects completed, clients, etc).
 */
export default function Counter({ to = 0, suffix = '', duration = 1400, label }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            animate();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function animate() {
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress); // ease-out
      setValue(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl font-semibold text-white sm:text-5xl">
        {value}
        {suffix}
      </div>
      <div className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-steel-light">{label}</div>
    </div>
  );
}
