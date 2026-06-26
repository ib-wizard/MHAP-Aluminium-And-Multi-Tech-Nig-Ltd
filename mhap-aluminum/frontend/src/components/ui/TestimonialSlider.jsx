import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function TestimonialSlider({ testimonials = [] }) {
  const [index, setIndex] = useState(0);

  if (testimonials.length === 0) {
    return (
      <p className="text-center font-mono text-sm text-steel-dark">
        Client testimonials will appear here once added from the admin dashboard.
      </p>
    );
  }

  const current = testimonials[index];

  function prev() {
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  }
  function next() {
    setIndex((i) => (i + 1) % testimonials.length);
  }

  return (
    <div className="relative mx-auto max-w-2xl text-center">
      <div className="flex justify-center gap-1 text-accent">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4" fill={i < current.rating ? 'currentColor' : 'none'} />
        ))}
      </div>

      <p className="mt-6 font-display text-xl leading-relaxed text-navy sm:text-2xl">
        &ldquo;{current.message}&rdquo;
      </p>

      <div className="mt-6">
        <div className="font-display text-sm font-semibold text-navy">{current.client_name}</div>
        {current.client_title && (
          <div className="font-mono text-xs uppercase tracking-wider text-steel-dark">{current.client_title}</div>
        )}
      </div>

      {testimonials.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="rounded-full border border-steel/30 p-2 text-navy transition-colors hover:border-accent hover:text-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 w-6 rounded-full transition-colors ${i === index ? 'bg-accent' : 'bg-steel/30'}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="rounded-full border border-steel/30 p-2 text-navy transition-colors hover:border-accent hover:text-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
