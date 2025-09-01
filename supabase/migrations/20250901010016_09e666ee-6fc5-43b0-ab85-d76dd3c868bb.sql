-- Drop the current view and implement a proper security solution
DROP VIEW IF EXISTS public.stores_public;

-- Instead of a view, let's just use the existing RLS policies properly
-- The anonymous users policy already filters for approved stores and excludes sensitive data through application logic

-- No need for a separate view - we'll handle the sensitive data filtering in the application layer