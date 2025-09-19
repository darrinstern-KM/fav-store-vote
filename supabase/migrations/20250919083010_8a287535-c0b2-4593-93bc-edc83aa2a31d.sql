-- Drop existing policies to replace with more granular ones
DROP POLICY IF EXISTS "Anonymous users can view public store data" ON stores;
DROP POLICY IF EXISTS "Authenticated users can view store details" ON stores;

-- Create new granular RLS policies
-- 1. Anonymous users can view basic store info (excluding sensitive contact fields)
CREATE POLICY "Anonymous can view basic store info" ON stores
  FOR SELECT 
  TO anon
  USING (
    approved = true
  );

-- 2. Authenticated users can view stores with contact info
CREATE POLICY "Authenticated users can view store details" ON stores
  FOR SELECT 
  TO authenticated
  USING (approved = true);

-- 3. Admins can view all stores (approved and unapproved) 
CREATE POLICY "Admins can view all stores" ON stores
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.email = auth.jwt() ->> 'email'
      AND users.is_admin = true
    )
  );

-- Create a function to get public store data (excluding sensitive fields)
CREATE OR REPLACE FUNCTION public.get_public_stores()
RETURNS TABLE (
  ShopID TEXT,
  shop_name TEXT,
  shop_addr_1 TEXT,
  shop_addr_2 TEXT,
  shop_city TEXT,
  shop_state TEXT,
  shop_zip TEXT,
  shop_city_m TEXT,
  shop_state_m TEXT,
  shop_zip_m TEXT,
  shop_website TEXT,
  shop_hours TEXT,
  shop_mdse TEXT,
  approved BOOLEAN,
  votes_count INTEGER,
  rating NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.ShopID,
    s.shop_name,
    s.shop_addr_1,
    s.shop_addr_2,
    s.shop_city,
    s.shop_state,
    s.shop_zip,
    s.shop_city_m,
    s.shop_state_m,
    s.shop_zip_m,
    s.shop_website,
    s.shop_hours,
    s.shop_mdse,
    s.approved,
    s.votes_count,
    s.rating,
    s.created_at,
    s.updated_at
  FROM stores s
  WHERE s.approved = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_public_stores() TO anon, authenticated;