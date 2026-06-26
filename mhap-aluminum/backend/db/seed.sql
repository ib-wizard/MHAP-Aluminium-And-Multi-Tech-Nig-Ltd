-- =====================================================================
-- Seed data for MHAP Aluminum and Multitech Nigeria Limited
-- Run AFTER schema.sql:
--   psql "$DATABASE_URL" -f db/seed.sql
-- Safe to re-run: uses ON CONFLICT / existence checks where it matters.
-- =====================================================================

-- Company profile (single row, id = 1 from schema.sql)
UPDATE company_profile SET
  company_name     = 'MHAP Aluminum and Multitech Nigeria Limited',
  slogan           = 'Crafting Quality, Shaping Excellence.',
  about_text       = 'MHAP Aluminum and Multitech Nigeria Limited is a Nigerian aluminum fabrication company dedicated to delivering world-class aluminum and glass solutions. We specialize in manufacturing and installing premium aluminum windows, doors, railings, partitions, curtain walls, and custom fabrication works with precision, durability, and elegance.',
  mission          = 'To deliver precision-engineered aluminum and glass solutions that exceed client expectations, on every site, every time.',
  vision           = 'To be Nigeria''s most trusted name in aluminum fabrication and building solutions.',
  core_values      = '["Precision","Integrity","Innovation","Durability","Customer Satisfaction"]',
  hero_heading     = 'Crafting Quality, Shaping Excellence.',
  hero_subheading  = 'Premium aluminum windows, doors, railings, curtain walls and custom fabrication for residential, commercial and industrial clients across Nigeria.',
  stat_projects_completed = 180,
  stat_happy_clients      = 150,
  stat_years_experience   = 12,
  stat_team_size          = 35,
  phone            = '+234 800 000 0000',
  whatsapp         = '+234 800 000 0000',
  email            = 'info@mhapaluminum.com',
  address          = 'Gombe State, Nigeria',
  facebook_url     = 'https://facebook.com',
  instagram_url    = 'https://instagram.com',
  tiktok_url       = 'https://tiktok.com',
  linkedin_url     = 'https://linkedin.com',
  primary_color    = '#0B1F3A',
  secondary_color  = '#8B9299',
  accent_color     = '#2D6CDF'
WHERE id = 1;

-- Services
INSERT INTO services (title, slug, short_description, full_description, icon, display_order) VALUES
('Aluminum Sliding Windows', 'aluminum-sliding-windows', 'Smooth-gliding, weather-sealed sliding windows engineered for durability and clean sightlines.', 'Our aluminum sliding windows combine slim profiles with multi-point locking and weather seals, giving you natural light and ventilation without compromising security or thermal performance.', 'panels-top-left', 1),
('Casement Windows', 'casement-windows', 'Side-hinged windows offering maximum ventilation and a tight, energy-efficient seal.', 'Casement windows from MHAP open outward on hinges for full ventilation control, with powder-coated frames available in a range of finishes to match any facade.', 'square', 2),
('Up-and-Over Windows', 'up-and-over-windows', 'Top-hung, projecting windows ideal for bathrooms, kitchens and ventilation-focused spaces.', 'Also known as up-and-across windows, these are designed for spaces that need controlled ventilation with a compact, low-maintenance frame.', 'panel-top', 3),
('Aluminum Doors', 'aluminum-doors', 'Durable, secure entrance and interior doors finished to a premium architectural standard.', 'From single entrance doors to multi-panel configurations, our aluminum doors are fabricated to precise tolerances for a flush, secure fit.', 'door-closed', 4),
('Sliding Doors', 'sliding-doors', 'Space-saving sliding door systems for patios, balconies and large openings.', 'Heavy-duty rollers and reinforced tracks give our sliding doors a smooth glide even on large glazed panels.', 'door-open', 5),
('Office Partitions', 'office-partitions', 'Modern aluminum-framed glass partitions for flexible, professional office layouts.', 'Demountable and fixed partition systems that let you reconfigure office space without major construction work.', 'layout-panel-left', 6),
('Staircase Railings', 'staircase-railings', 'Elegant aluminum and glass railings that combine safety with a refined finished look.', 'Custom-fabricated to your staircase dimensions, with a choice of glass infill, balusters, or solid panel railings.', 'move-vertical', 7),
('Glass Balustrades', 'glass-balustrades', 'Frameless and semi-frameless glass balustrades for balconies, terraces and stairwells.', 'Structural glass balustrades fabricated and installed to current safety standards, finished with discreet aluminum hardware.', 'rectangle-vertical', 8),
('Curtain Wall Systems', 'curtain-wall-systems', 'Structural glazing for commercial facades that combine strength with a sleek glass envelope.', 'Our curtain wall systems are engineered for Nigeria''s climate, balancing thermal performance, structural load, and architectural ambition.', 'building-2', 9),
('Glass Installations', 'glass-installations', 'Precision glass installation for windows, partitions, facades and decorative applications.', 'We supply and install tempered, laminated and decorative glass to match your project specification.', 'square-stack', 10),
('Shower Cubicles', 'shower-cubicles', 'Frameless and semi-frameless shower enclosures finished to a premium standard.', 'Custom-measured shower cubicles with tempered safety glass and corrosion-resistant aluminum or stainless fittings.', 'bath', 11),
('Handrails', 'handrails', 'Aluminum handrail systems for stairways, ramps and walkways, indoors and out.', 'Built to code for safety and finished to complement your building''s overall aesthetic.', 'minus', 12),
('ACP Cladding', 'acp-cladding', 'Aluminum Composite Panel cladding for striking, weather-resistant building facades.', 'ACP cladding gives commercial buildings a modern finished envelope while protecting the structure from the elements.', 'layout-template', 13),
('Storefronts', 'storefronts', 'Commercial storefront systems that maximize glazing while standing up to daily use.', 'Storefront framing systems designed for high-traffic retail and commercial entrances.', 'store', 14),
('General Aluminum Fabrication', 'general-aluminum-fabrication', 'Workshop fabrication services for bespoke aluminum components and structures.', 'Our in-house fabrication shop handles cutting, welding, and finishing for projects of any scale.', 'wrench', 15),
('Custom Aluminum Projects', 'custom-aluminum-projects', 'Bespoke aluminum and glass solutions engineered to your exact specification.', 'Have a non-standard requirement? Our engineering team designs and fabricates custom aluminum solutions from concept to installation.', 'pencil-ruler', 16)
ON CONFLICT (slug) DO NOTHING;

-- Sample projects
INSERT INTO projects (title, slug, client_name, location, category, project_date, description, is_featured) VALUES
('Federal Lowcost Estate Curtain Wall', 'federal-lowcost-estate-curtain-wall', 'Federal Housing Authority', 'Gombe, Gombe State', 'Curtain Wall Systems', '2025-03-15', 'Full structural glazing for a 4-storey commercial block, including curtain wall, storefront entrances and ACP cladding accents.', TRUE),
('Tudun Wada Residence Sliding Windows', 'tudun-wada-residence-sliding-windows', 'Alh. Musa Ibrahim', 'Tudun Wada, Gombe State', 'Aluminum Sliding Windows', '2025-01-20', 'Supply and installation of aluminum sliding windows and doors across a 5-bedroom residence.', FALSE),
('Pantami Plaza Storefronts', 'pantami-plaza-storefronts', 'Pantami Investments Ltd', 'Pantami, Gombe State', 'Storefronts', '2024-11-05', 'Storefront glazing and aluminum framing for a 12-unit retail plaza.', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Sample testimonials
INSERT INTO testimonials (client_name, client_title, message, rating, display_order) VALUES
('Alh. Musa Ibrahim', 'Homeowner, Gombe', 'MHAP handled our windows and doors from measurement to installation with real precision. Everything fits perfectly and the finish looks premium.', 5, 1),
('Hauwa Bello', 'Facility Manager, Pantami Investments Ltd', 'Professional team, clean work, and they delivered on schedule. Our storefronts have completely changed the look of the plaza.', 5, 2),
('Eng. Ahmed Yusuf', 'Project Consultant', 'Their curtain wall installation team understood the engineering requirements and worked closely with our site supervisors throughout.', 4, 3)
ON CONFLICT DO NOTHING;
