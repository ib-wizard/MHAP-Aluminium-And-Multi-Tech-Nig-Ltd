import { motion } from 'framer-motion';
import { ShieldCheck, Target, Eye, Award } from 'lucide-react';
import { useQuery } from '../hooks/useQuery';
import { getCompany } from '../api/client';
import ExtrusionDivider from '../components/ui/ExtrusionDivider';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function About() {
  const { data: company } = useQuery(getCompany, []);

  let values = [];
  try {
    values = company?.core_values ? JSON.parse(company.core_values) : [];
  } catch {
    values = [];
  }

  return (
    <>
      <section className="blueprint-bg pt-32 pb-20">
        <div className="container-page">
          <span className="eyebrow">About Us</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold text-white sm:text-5xl">
            Built on precision. Proven on site.
          </h1>
        </div>
      </section>

      <ExtrusionDivider tone="dark" />

      <section className="container-page py-20">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="max-w-3xl">
          <p className="text-lg leading-relaxed text-steel-dark">
            {company?.about_text ||
              'MHAP Aluminum and Multitech Nigeria Limited is a Nigerian aluminum fabrication company dedicated to delivering world-class aluminum and glass solutions. We specialize in manufacturing and installing premium aluminum windows, doors, railings, partitions, curtain walls, and custom fabrication works with precision, durability, and elegance.'}
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          <div className="panel p-8">
            <Target className="h-7 w-7 text-accent" />
            <h3 className="mt-5 font-display text-lg font-semibold text-navy">Our Mission</h3>
            <p className="mt-3 text-sm leading-relaxed text-steel-dark">
              {company?.mission ||
                'To deliver precision-engineered aluminum and glass solutions that exceed client expectations, on every site, every time.'}
            </p>
          </div>
          <div className="panel p-8">
            <Eye className="h-7 w-7 text-accent" />
            <h3 className="mt-5 font-display text-lg font-semibold text-navy">Our Vision</h3>
            <p className="mt-3 text-sm leading-relaxed text-steel-dark">
              {company?.vision || "To be Nigeria's most trusted name in aluminum fabrication and building solutions."}
            </p>
          </div>
        </div>

        {values.length > 0 && (
          <div className="mt-16">
            <h3 className="font-display text-lg font-semibold text-navy">Core Values</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value, i) => (
                <div key={i} className="flex items-center gap-3 border border-steel/15 bg-white p-5">
                  {i % 2 === 0 ? <ShieldCheck className="h-5 w-5 text-accent" /> : <Award className="h-5 w-5 text-accent" />}
                  <span className="font-display text-sm font-medium text-navy">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
