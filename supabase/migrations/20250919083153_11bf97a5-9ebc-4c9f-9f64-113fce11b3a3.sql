-- Fix the search_path security warning for the function
CREATE OR REPLACE FUNCTION public.get_public_stores()
RETURNS TABLE (
  ShopID TEXT,
  shop_name TEXT,
  shop_addr_1 TEXT,
  shop_addr_2 TEXT,
  shop_city TEXT,
  shop_state TEXT,
  shop_zip TEXT,
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;