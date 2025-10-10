-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Only service role and admins can view stores" ON public.stores;

-- Create a new policy that allows public to view approved stores
CREATE POLICY "Public can view approved stores"
ON public.stores
FOR SELECT
TO public
USING (approved = true);

-- Keep the admin policy for viewing all stores (including unapproved)
CREATE POLICY "Admins can view all stores"
ON public.stores
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));