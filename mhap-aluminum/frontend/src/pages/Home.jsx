import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FolderKanban, Phone } from 'lucide-react';
import { useQuery } from '../hooks/useQuery';
import { getCompany, getServices, getProjects, getTestimonials, resolveAssetUrl } from '../api/client';
import Counter from '../components/ui/Counter';
import ServiceCard from '../components/ui/ServiceCard';
import ProjectCard from '../components/ui/ProjectCard';
import TestimonialSlider from '../components/ui/TestimonialSlider';
import ExtrusionDivider from '../components/ui/ExtrusionDivider';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Home() {
  const { data: company } = useQuery(getCompany, []);
  const { data: services } = useQuery(getServices, []);
  const { data: projectsRes } = useQuery(() => getProjects({ pageSize: 3 }), []);
  const { data: testimonials } = useQuery(getTestimonials, []);

  const heroHeading = company?.hero_heading || 'Crafting Quality, Shaping Excellence.';
  const heroSub =
    company?.hero_subheading ||
    'Premium aluminum windows, doors, railings, curtain walls and custom fabrication for residential, commercial and industrial clients across Nigeria.';

  return (
    <>
      {/* ---- Hero ------------------------------------------------------ */}
      <section
        className="relative flex min-h-screen items-center overflow-hidden blueprint-bg pt-20"
        style={
          company?.hero_image_url
            ? {
                backgroundImage: `linear-gradient(rgba(7,21,39,0.82), rgba(7,21,39,0.92)), url(${resolveAssetUrl(company.hero_image_url)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        <div className="container-page relative z-10 py-24">
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-3xl">
            <span className="eyebrow">Aluminum Fabrication &amp; Building Solutions — Gombe State, Nigeria</span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
              {heroHeading}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-steel-light sm:text-lg">{heroSub}</p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/quote" className="btn-primary">
                Get a Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/projects" className="btn-outline">
                <FolderKanban className="h-4 w-4" /> View Projects
              </Link>
              <Link to="/contact" className="btn-outline">
                <Phone className="h-4 w-4" /> Contact Us
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-navy-deep/70 backdrop-blur-sm">
          <div className="container-page grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
            <Counter to={company?.stat_projects_completed ?? 180} suffix="+" label="Projects Completed" />
            <Counter to={company?.stat_happy_clients ?? 150} suffix="+" label="Happy Clients" />
            <Counter to={company?.stat_years_experience ?? 12} suffix="+" label="Years of Experience" />
            <Counter to={company?.stat_team_size ?? 35} suffix="+" label="Professional Team" />
          </div>
        </div>
      </section>

      <ExtrusionDivider tone="dark" />

      {/* ---- Services preview ------------------------------------------ */}
      <section className="container-page py-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="max-w-2xl"
        >
          <span className="eyebrow">What We Build</span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-navy sm:text-4xl">
            Engineering precision, finished to a premium standard.
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-px overflow-hidden border border-steel/15 bg-steel/15 sm:grid-cols-2 lg:grid-cols-3">
          {(services || []).slice(0, 6).map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/services" className="btn-dark">
            View All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ---- Featured projects ------------------------------------------ */}
      {projectsRes?.items?.length > 0 && (
        <section className="bg-steel-light/30 py-24">
          <div className="container-page">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="flex flex-wrap items-end justify-between gap-4"
            >
              <div>
                <span className="eyebrow">Recent Work</span>
                <h2 className="mt-3 font-display text-3xl font-semibold text-navy sm:text-4xl">Featured Projects</h2>
              </div>
              <Link to="/projects" className="font-display text-sm font-medium text-accent hover:text-accent-dark">
                View full gallery &rarr;
              </Link>
            </motion.div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projectsRes.items.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Testimonials ------------------------------------------ */}
      <section className="container-page py-24">
        <div className="text-center">
          <span className="eyebrow">Client Feedback</span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-navy sm:text-4xl">What Our Clients Say</h2>
        </div>
        <div className="mt-12">
          <TestimonialSlider testimonials={testimonials || []} />
        </div>
      </section>

      {/* ---- CTA banner ------------------------------------------ */}
      <section className="blueprint-bg py-20">
        <div className="container-page flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Ready to start your project?
          </h2>
          <p className="max-w-xl text-steel-light">
            Tell us what you're building and we'll put together a detailed quotation.
          </p>
          <Link to="/quote" className="btn-primary">
            Request a Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
