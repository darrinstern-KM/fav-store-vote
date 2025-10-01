-- Drop the overly permissive public SELECT policies
DROP POLICY IF EXISTS "Anonymous can view basic store info" ON stores;
DROP POLICY IF EXISTS "Authenticated users can view store details" ON stores;

-- Create new restrictive policy: Only admins and service role can view all store data
-- Public access will be through the existing get_public_stores() function which filters sensitive fields
CREATE POLICY "Only service role and admins can view stores" ON stores
  FOR SELECT 
  USING (
    -- Allow service role (for backend operations)
    auth.jwt()->>'role' = 'service_role'
  );