-- Ensure required extension for UUIDs is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the stores table with the requested columns if it doesn't exist
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id TEXT UNIQUE NOT NULL,
  shop_name TEXT NOT NULL,
  shop_addr_1 TEXT,
  shop_addr_2 TEXT,
  shop_city TEXT,
  shop_state TEXT,
  shop_zip TEXT,
  shop_addr_1_m TEXT,
  shop_addr_2_m TEXT,
  shop_city_m TEXT,
  shop_state_m TEXT,
  shop_zip_m TEXT,
  shop_phone_1 TEXT,
  shop_phone_2 TEXT,
  shop_email TEXT,
  shop_website TEXT,
  shop_owner TEXT,
  shop_hours TEXT,
  shop_mdse TEXT,
  -- Extra operational fields (optional for your app, but helpful)
  approved BOOLEAN DEFAULT false,
  votes_count INTEGER DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- If the table already existed, ensure all requested columns are present
ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS shop_id TEXT,
  ADD COLUMN IF NOT EXISTS shop_name TEXT,
  ADD COLUMN IF NOT EXISTS shop_addr_1 TEXT,
  ADD COLUMN IF NOT EXISTS shop_addr_2 TEXT,
  ADD COLUMN IF NOT EXISTS shop_city TEXT,
  ADD COLUMN IF NOT EXISTS shop_state TEXT,
  ADD COLUMN IF NOT EXISTS shop_zip TEXT,
  ADD COLUMN IF NOT EXISTS shop_addr_1_m TEXT,
  ADD COLUMN IF NOT EXISTS shop_addr_2_m TEXT,
  ADD COLUMN IF NOT EXISTS shop_city_m TEXT,
  ADD COLUMN IF NOT EXISTS shop_state_m TEXT,
  ADD COLUMN IF NOT EXISTS shop_zip_m TEXT,
  ADD COLUMN IF NOT EXISTS shop_phone_1 TEXT,
  ADD COLUMN IF NOT EXISTS shop_phone_2 TEXT,
  ADD COLUMN IF NOT EXISTS shop_email TEXT,
  ADD COLUMN IF NOT EXISTS shop_website TEXT,
  ADD COLUMN IF NOT EXISTS shop_owner TEXT,
  ADD COLUMN IF NOT EXISTS shop_hours TEXT,
  ADD COLUMN IF NOT EXISTS shop_mdse TEXT,
  ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS votes_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW());

-- Ensure uniqueness on shop_id (if the table pre-existed)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'stores_shop_id_unique'
  ) THEN
    ALTER TABLE public.stores
    ADD CONSTRAINT stores_shop_id_unique UNIQUE (shop_id);
  END IF;
END $$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_stores_shop_id ON public.stores(shop_id);
CREATE INDEX IF NOT EXISTS idx_stores_state_city ON public.stores(shop_state, shop_city);
CREATE INDEX IF NOT EXISTS idx_stores_zip ON public.stores(shop_zip);

-- Enable RLS
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Public read access (you can tighten this later when auth is in place)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'stores' AND policyname = 'Public can view stores'
  ) THEN
    CREATE POLICY "Public can view stores" ON public.stores
    FOR SELECT USING (true);
  END IF;
END $$;

-- Allow public inserts (you can switch to authenticated-only later)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'stores' AND policyname = 'Public can insert stores'
  ) THEN
    CREATE POLICY "Public can insert stores" ON public.stores
    FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- updated_at maintenance trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_stores_updated_at ON public.stores;
CREATE TRIGGER trg_set_stores_updated_at
BEFORE UPDATE ON public.stores
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();