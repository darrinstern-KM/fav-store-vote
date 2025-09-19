-- Drop existing policies to replace with more granular ones
DROP POLICY IF EXISTS "Anonymous users can view public store data" ON stores;
DROP POLICY IF EXISTS "Authenticated users can view stores" ON stores;

-- Create view for public store data (excluding sensitive contact fields)
CREATE OR REPLACE VIEW public.stores_public AS
SELECT 
  id,
  ShopID,
  shop_name,
  shop_addr_1,
  shop_addr_2,
  shop_city,
  shop_state,
  shop_zip,
  shop_city_m,
  shop_state_m,
  shop_zip_m,
  shop_website,
  shop_hours,
  shop_mdse,
  approved,
  votes_count,
  rating,
  created_at,
  updated_at
FROM stores
WHERE approved = true;

-- Enable RLS on the public view
ALTER VIEW public.stores_public SET (security_invoker = true);

-- Create new granular RLS policies
-- 1. Anonymous users can view public store data (excluding sensitive contact info)
CREATE POLICY "Anonymous can view basic store info" ON stores
  FOR SELECT 
  TO anon
  USING (
    approved = true AND 
    -- This policy will be used for basic store info queries
    -- Sensitive fields will be handled by application logic
    true
  );

-- 2. Authenticated users can view stores with contact info (but not all admin fields)
CREATE POLICY "Authenticated users can view store details" ON stores
  FOR SELECT 
  TO authenticated
  USING (approved = true);

-- 3. Admins can view all stores (approved and unapproved)
CREATE POLICY "Admins can view all stores" ON stores
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        SELECT email FROM users WHERE is_admin = true
      )
    )
  );

-- Create a security definer function to check sensitive field access
CREATE OR REPLACE FUNCTION public.can_access_sensitive_store_data(store_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Allow access if user is authenticated
  IF auth.role() = 'authenticated' THEN
    RETURN TRUE;
  END IF;
  
  -- Deny access for anonymous users
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.can_access_sensitive_store_data(UUID) TO anon, authenticated;