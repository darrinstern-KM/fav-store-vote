-- Drop the previous view and recreate with security_invoker=on to respect RLS
DROP VIEW IF EXISTS public.stores_public;

-- Create a secure public view that excludes sensitive business owner information
-- Using security_invoker=on to respect row level security policies
CREATE VIEW public.stores_public
WITH (security_invoker=on) AS
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

-- Grant public access to the stores_public view (no sensitive data)
GRANT SELECT ON stores_public TO anon;
GRANT SELECT ON stores_public TO authenticated;