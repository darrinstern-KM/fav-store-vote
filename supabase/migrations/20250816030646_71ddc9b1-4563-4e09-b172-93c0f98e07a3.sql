-- Bulk approve all existing stores so they show up in search
UPDATE public.stores 
SET approved = true 
WHERE approved IS NULL OR approved = false;

-- Create indexes to improve search performance
CREATE INDEX IF NOT EXISTS idx_stores_search_text 
ON public.stores USING gin (
  to_tsvector('english', 
    COALESCE(shop_name, '') || ' ' || 
    COALESCE(shop_city, '') || ' ' || 
    COALESCE(shop_state, '') || ' ' ||
    COALESCE(shop_zip, '')
  )
);

-- Create individual indexes for common searches
CREATE INDEX IF NOT EXISTS idx_stores_zip ON public.stores (shop_zip);
CREATE INDEX IF NOT EXISTS idx_stores_city ON public.stores (shop_city);
CREATE INDEX IF NOT EXISTS idx_stores_state ON public.stores (shop_state);
CREATE INDEX IF NOT EXISTS idx_stores_approved ON public.stores (approved);