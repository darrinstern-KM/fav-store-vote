-- Fix the security definer issue by explicitly setting SECURITY INVOKER
-- Drop and recreate the view with proper security settings
DROP VIEW IF EXISTS public.stores_public;

CREATE VIEW public.stores_public
WITH (security_invoker = true)
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

-- Grant select permission on the view
GRANT SELECT ON public.stores_public TO anon;
GRANT SELECT ON public.stores_public TO authenticated;

COMMENT ON VIEW public.stores_public IS 'Public-safe view of approved stores without sensitive contact information (email, phone numbers). Uses security_invoker to enforce RLS of querying user.';