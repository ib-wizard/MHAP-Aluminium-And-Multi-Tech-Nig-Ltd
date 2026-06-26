import { motion } from 'framer-motion';
import { useQuery } from '../hooks/useQuery';
import { getServices } from '../api/client';
import Icon from '../components/ui/Icon';
import ExtrusionDivider from '../components/ui/ExtrusionDivider';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Services() {
  const { data: services, loading } = useQuery(getServices, []);

  return (
    <>
      <section className="blueprint-bg pt-32 pb-20">
        <div className="container-page">
          <span className="eyebrow">Our Services</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold text-white sm:text-5xl">
            Every component of a finished building envelope.
          </h1>
          <p className="mt-5 max-w-2xl text-steel-light">
            From a single sliding window to a full curtain wall facade, every job is fabricated in-house and
            installed by our own engineering team.
          </p>
        </div>
      </section>

      <ExtrusionDivider tone="dark" />

      <section className="container-page py-20">
        {loading && <p className="text-center font-mono text-sm text-steel-dark">Loading services...</p>}

        <div className="divide-y divide-steel/15 border-y border-steel/15">
          {(services || []).map((service, i) => (
            <motion.div
              key={service.id}
              id={service.slug}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="grid gap-6 py-10 sm:grid-cols-[auto,1fr] sm:gap-10"
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs text-steel-dark">{String(i + 1).padStart(2, '0')}</span>
                <Icon name={service.icon} className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-navy">{service.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-steel-dark">
                  {service.full_description || service.short_description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
