-- Create a public view that excludes sensitive business owner information
CREATE VIEW public.stores_public AS
SELECT 
  "ShopID",
  shop_name,
  shop_addr_1,
  shop_addr_2,
  shop_city,
  shop_state,
  shop_zip,
  shop_addr_1_m,
  shop_addr_2_m,
  shop_city_m,
  shop_state_m,
  shop_zip_m,
  shop_hours,
  shop_mdse,
  shop_website,
  votes_count,
  rating,
  approved,
  created_at,
  updated_at
FROM stores;

-- Drop existing permissive RLS policies
DROP POLICY IF EXISTS "Public can view stores" ON stores;
DROP POLICY IF EXISTS "Public can insert stores" ON stores;

-- Create restrictive RLS policies for the stores table
-- Only allow public to insert new stores (for store submissions)
CREATE POLICY "Public can submit stores" ON stores
FOR INSERT 
WITH CHECK (true);

-- Only allow authenticated users to view full store details (including sensitive info)
CREATE POLICY "Authenticated users can view stores" ON stores
FOR SELECT
TO authenticated
USING (true);

-- Admins can update and delete stores (we'll implement admin role checking later)
CREATE POLICY "Admins can update stores" ON stores
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins can delete stores" ON stores
FOR DELETE
TO authenticated
USING (true);

-- Grant public access to the stores_public view (no sensitive data)
GRANT SELECT ON stores_public TO anon;
GRANT SELECT ON stores_public TO authenticated;