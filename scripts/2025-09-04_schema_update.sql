-- Schema update to align database with new/updated dialogs (home improvements, service providers, vehicles, community posts)
-- Safe (idempotent) alterations: all use IF NOT EXISTS or guard clauses.

-- 1. community_posts: add category for new post category dropdown
ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS category TEXT; -- e.g. 'Home','Auto','DIY','Recommendations'

-- Optional: basic index for filtering by category
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'idx_community_posts_category'
  ) THEN
    CREATE INDEX idx_community_posts_category ON public.community_posts (category);
  END IF;
END $$;

-- 2. service_providers: fields for hierarchical subtype + service area + reviews
ALTER TABLE public.service_providers
  ADD COLUMN IF NOT EXISTS service_subtype TEXT,       -- mapped from subcategory select
  ADD COLUMN IF NOT EXISTS service_area TEXT,          -- geographic / coverage area (was previously overloading address)
  ADD COLUMN IF NOT EXISTS reviews TEXT,               -- simple aggregated reviews text (future: move to separate table)
  ADD COLUMN IF NOT EXISTS logo_url TEXT;              -- distinct from generic image_url if needed

-- Ensure rating constraint (0-5). Add if missing.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'service_providers_rating_range'
  ) THEN
    ALTER TABLE public.service_providers
      ADD CONSTRAINT service_providers_rating_range CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5));
  END IF;
END $$;

-- Indexes to speed up directory filtering
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_service_providers_category') THEN
    CREATE INDEX idx_service_providers_category ON public.service_providers (category);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_service_providers_service_subtype') THEN
    CREATE INDEX idx_service_providers_service_subtype ON public.service_providers (service_subtype);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_service_providers_service_area') THEN
    CREATE INDEX idx_service_providers_service_area ON public.service_providers (service_area);
  END IF;
END $$;

-- 3. home_improvements: new dialog adds description, materials_category, contractor
ALTER TABLE public.home_improvements
  ADD COLUMN IF NOT EXISTS description TEXT,          -- detailed description (was previously only notes)
  ADD COLUMN IF NOT EXISTS materials_category TEXT,   -- selected materials group
  ADD COLUMN IF NOT EXISTS contractor TEXT;           -- vendor / contractor name

-- Optional future fields (uncomment if/when dialog adds them)
-- ALTER TABLE public.home_improvements ADD COLUMN IF NOT EXISTS budget DECIMAL(12,2);
-- ALTER TABLE public.home_improvements ADD COLUMN IF NOT EXISTS status TEXT; -- e.g., Planned, In Progress, Completed

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_home_improvements_materials_category') THEN
    CREATE INDEX idx_home_improvements_materials_category ON public.home_improvements (materials_category);
  END IF;
END $$;

-- 4. vehicles: ensure structured year/make/model columns used by new vehicle creation dialog
ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS year INT,
  ADD COLUMN IF NOT EXISTS make TEXT,
  ADD COLUMN IF NOT EXISTS model TEXT;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_vehicles_user_make_model_year') THEN
    CREATE INDEX idx_vehicles_user_make_model_year ON public.vehicles (user_id, make, model, year);
  END IF;
END $$;

-- 5. vehicle_maintenance: (optional persistence of interval metadata for smarter suggestions later)
-- Uncomment if you decide to store chosen interval.
-- ALTER TABLE public.vehicle_maintenance ADD COLUMN IF NOT EXISTS interval_miles INT;
-- ALTER TABLE public.vehicle_maintenance ADD COLUMN IF NOT EXISTS interval_months INT;

-- 6. vehicle_repairs: unified warranty end date (keeping existing part/labor columns for now)
ALTER TABLE public.vehicle_repairs
  ADD COLUMN IF NOT EXISTS warranty_end_date DATE; -- when using simplified single warranty dropdown

-- 7. purchases: warranty type (dropdown) if implemented (Manufacturer / Extended / None)
-- ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS warranty_type TEXT;

-- 8. home_maintenance: capture system type from new simplified dropdown (HVAC, Plumbing, Electrical, etc.)
ALTER TABLE public.home_maintenance
  ADD COLUMN IF NOT EXISTS system_type TEXT;

-- 9. rooms: support hierarchical presets (room_category) & flag if auto-generated
ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS room_category TEXT,      -- e.g., Interior > Bedroom
  ADD COLUMN IF NOT EXISTS generated_from_preset BOOLEAN DEFAULT FALSE;

-- 10. Data backfill examples (NO-OP placeholders; adjust as needed)
-- UPDATE public.home_improvements SET description = notes WHERE description IS NULL; -- if you want to seed description from notes
-- UPDATE public.service_providers SET service_area = address WHERE service_area IS NULL AND address IS NOT NULL;

-- 11. Permissions remain unchanged; existing RLS policies already cover these tables.
-- No policy changes required because added columns inherit table-level policies.

-- 12. (Optional) Add simple enum types later for stronger constraints (category, materials_category, system_type, etc.) once value sets stabilize.

-- Completed.
