-- Fix Security Definer view by recreating vote_statistics as SECURITY INVOKER
DROP VIEW IF EXISTS public.vote_statistics;

CREATE VIEW public.vote_statistics
WITH (security_invoker = true)
AS
SELECT 
  store_id,
  COUNT(*) AS vote_count,
  AVG(rating) AS avg_rating,
  COUNT(comment) FILTER (WHERE comment IS NOT NULL) AS comment_count
FROM public.votes
GROUP BY store_id;

-- Grant access to anonymous and authenticated users
GRANT SELECT ON public.vote_statistics TO anon, authenticated;

-- Create a public stores view that excludes sensitive contact information
CREATE OR REPLACE VIEW public.public_stores
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

-- Grant access to public stores view
GRANT SELECT ON public.public_stores TO anon, authenticated;

-- Drop the old function as it's being replaced by the view
DROP FUNCTION IF EXISTS public.get_public_stores();