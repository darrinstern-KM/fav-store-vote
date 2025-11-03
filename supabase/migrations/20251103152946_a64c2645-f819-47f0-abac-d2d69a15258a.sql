-- Create a public-safe view of stores that excludes sensitive contact information
CREATE OR REPLACE VIEW public.stores_public AS
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

-- Update RLS policy on stores table to restrict public access
-- Drop the old public view policy
DROP POLICY IF EXISTS "Public can view approved stores" ON public.stores;

-- Create new policy that only allows viewing through the view or for authenticated users
CREATE POLICY "Authenticated users can view approved stores"
ON public.stores
FOR SELECT
TO authenticated
USING (approved = true);

-- Admins still have full access through existing "Admins can view all stores" policy

COMMENT ON VIEW public.stores_public IS 'Public-safe view of approved stores without sensitive contact information (email, phone numbers)';