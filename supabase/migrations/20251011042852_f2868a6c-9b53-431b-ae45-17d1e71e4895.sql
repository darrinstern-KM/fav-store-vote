-- Fix the security definer view warning
-- Drop and recreate the vote_statistics view WITHOUT security definer
DROP VIEW IF EXISTS public.vote_statistics;

CREATE VIEW public.vote_statistics AS
SELECT 
  store_id,
  COUNT(*) as vote_count,
  AVG(rating)::numeric(3,2) as avg_rating,
  COUNT(*) FILTER (WHERE comment IS NOT NULL AND comment != '') as comment_count
FROM votes
GROUP BY store_id;

-- Grant public access to the statistics view
GRANT SELECT ON public.vote_statistics TO anon;
GRANT SELECT ON public.vote_statistics TO authenticated;