-- =====================================================================
-- MHAP Aluminum and Multitech Nigeria Limited
-- PostgreSQL schema
--
-- Run with:
--   psql "$DATABASE_URL" -f db/schema.sql
-- or, if using discrete PG* vars:
--   psql -h $PGHOST -U $PGUSER -d $PGDATABASE -f db/schema.sql
-- =====================================================================

-- Needed for gen_random_uuid() and citext-free case-insensitive emails
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------
-- ENUM types
-- ---------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE quote_status AS ENUM ('pending', 'reviewing', 'quoted', 'completed', 'declined');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE admin_role AS ENUM ('superadmin', 'editor');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------
-- Admin users
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          admin_role NOT NULL DEFAULT 'editor',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Company profile / global site settings (single row table)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS company_profile (
  id                 SERIAL PRIMARY KEY,
  company_name       VARCHAR(255) NOT NULL DEFAULT 'MHAP Aluminum and Multitech Nigeria Limited',
  slogan             VARCHAR(255) NOT NULL DEFAULT 'Crafting Quality, Shaping Excellence.',
  logo_url           TEXT,
  about_text         TEXT,
  mission            TEXT,
  vision             TEXT,
  core_values        TEXT,                -- stored as JSON-encoded array of strings
  hero_heading       VARCHAR(255) DEFAULT 'Crafting Quality, Shaping Excellence.',
  hero_subheading    TEXT,
  hero_image_url     TEXT,
  banner_image_url   TEXT,
  stat_projects_completed INTEGER NOT NULL DEFAULT 0,
  stat_happy_clients      INTEGER NOT NULL DEFAULT 0,
  stat_years_experience   INTEGER NOT NULL DEFAULT 0,
  stat_team_size          INTEGER NOT NULL DEFAULT 0,
  phone              VARCHAR(50),
  whatsapp           VARCHAR(50),
  email              VARCHAR(255),
  address            TEXT,
  map_embed_url      TEXT,
  facebook_url       TEXT,
  instagram_url      TEXT,
  tiktok_url         TEXT,
  linkedin_url       TEXT,
  primary_color      VARCHAR(20) DEFAULT '#0B1F3A',
  secondary_color    VARCHAR(20) DEFAULT '#8B9299',
  accent_color       VARCHAR(20) DEFAULT '#2D6CDF',
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(150) NOT NULL,
  slug          VARCHAR(170) NOT NULL UNIQUE,
  short_description TEXT,
  full_description  TEXT,
  icon          VARCHAR(100) DEFAULT 'layout-grid',  -- lucide-react icon name
  image_url     TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_active_order ON services (is_active, display_order);

-- ---------------------------------------------------------------------
-- Projects + project images (gallery for "Projects" page)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  slug          VARCHAR(220) NOT NULL UNIQUE,
  client_name   VARCHAR(150),
  location      VARCHAR(150),
  category      VARCHAR(100),      -- e.g. Windows, Doors, Curtain Wall, ACP Cladding
  project_date  DATE,
  description   TEXT,
  cover_image_url TEXT,
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  is_published  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects (is_published);

CREATE TABLE IF NOT EXISTS project_images (
  id            SERIAL PRIMARY KEY,
  project_id    INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url     TEXT NOT NULL,
  caption       VARCHAR(255),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images (project_id);

-- ---------------------------------------------------------------------
-- General gallery (independent of specific projects)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery_images (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(200),
  category      VARCHAR(100),
  image_url     TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Testimonials
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id            SERIAL PRIMARY KEY,
  client_name   VARCHAR(150) NOT NULL,
  client_title  VARCHAR(150),       -- e.g. "Homeowner, Gombe" or "Project Manager, XYZ Ltd"
  client_image_url TEXT,
  message       TEXT NOT NULL,
  rating        SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Quote requests
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quote_requests (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  phone         VARCHAR(50) NOT NULL,
  email         VARCHAR(255),
  project_type  VARCHAR(150),
  description   TEXT NOT NULL,
  budget        VARCHAR(100),
  attachment_url TEXT,
  status        quote_status NOT NULL DEFAULT 'pending',
  admin_notes   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests (status);

-- ---------------------------------------------------------------------
-- Contact messages (from the Contact page form)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  phone         VARCHAR(50),
  subject       VARCHAR(200),
  message       TEXT NOT NULL,
  is_read       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages (is_read);

-- ---------------------------------------------------------------------
-- Generic key/value website settings (theme toggles, feature flags, SEO defaults)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS website_settings (
  key           VARCHAR(100) PRIMARY KEY,
  value         TEXT,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- updated_at auto-touch trigger, applied to the tables that track edits
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['admin_users','company_profile','services','projects','quote_requests']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_set_updated_at ON %I;', t);
    EXECUTE format(
      'CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t
    );
  END LOOP;
END $$;

-- Ensure there is always exactly one company_profile row to update against
INSERT INTO company_profile (id)
SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM company_profile WHERE id = 1);
