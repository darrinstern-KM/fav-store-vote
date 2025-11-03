-- Allow anonymous users to view approved stores
-- This is safe because the stores_public view excludes sensitive contact information
DROP POLICY IF EXISTS "Authenticated users can view approved stores" ON public.stores;

CREATE POLICY "Public can view approved stores"
  ON public.stores
  FOR SELECT
  USING (approved = true);