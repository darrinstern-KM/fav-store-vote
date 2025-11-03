-- Fix stores_public view to use SECURITY DEFINER
-- This allows the view to access approved stores regardless of caller's permissions
DROP VIEW IF EXISTS public.stores_public CASCADE;

CREATE VIEW public.stores_public
WITH (security_invoker = false)
AS
SELECT 
  "ShopID",
  shop_name,
  shop_addr_1,
  shop_addr_2,
  shop_city,
  shop_state,
  shop_zip,
  shop_website,
  shop_hours,
  shop_mdse,
  approved,
  votes_count,
  rating,
  created_at,
  updated_at
FROM public.stores
WHERE approved = true;