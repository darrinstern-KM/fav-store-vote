-- Create a specific RLS policy for anonymous users to access only non-sensitive data
CREATE POLICY "Anonymous users can view public store data" ON stores
FOR SELECT
TO anon
USING (approved = true);

-- Update the view to remove the security_invoker since we now have proper RLS
DROP VIEW IF EXISTS public.stores_public;

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
FROM stores
WHERE approved = true;