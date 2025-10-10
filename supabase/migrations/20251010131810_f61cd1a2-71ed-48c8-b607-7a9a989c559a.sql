-- Fix critical security issues

-- 1. DROP THE DANGEROUS PUBLIC VOTES POLICY
DROP POLICY IF EXISTS "Anyone can view votes" ON public.votes;

-- 2. CREATE SECURE POLICIES FOR VOTES TABLE
-- Users can only view their own votes
DROP POLICY IF EXISTS "Users can view own votes" ON public.votes;
CREATE POLICY "Users can view own votes"
ON public.votes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all votes (for admin panel)
DROP POLICY IF EXISTS "Admins can view all votes" ON public.votes;
CREATE POLICY "Admins can view all votes"
ON public.votes
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. CREATE A PUBLIC VIEW FOR VOTE STATISTICS (no PII)
CREATE OR REPLACE VIEW public.vote_statistics AS
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

-- 4. ADD DATABASE CONSTRAINTS FOR INPUT VALIDATION
-- Drop existing constraints if they exist
ALTER TABLE votes DROP CONSTRAINT IF EXISTS rating_range;
ALTER TABLE votes DROP CONSTRAINT IF EXISTS comment_length;
ALTER TABLE votes DROP CONSTRAINT IF EXISTS valid_voting_method;

-- Add constraints
ALTER TABLE votes ADD CONSTRAINT rating_range CHECK (rating BETWEEN 1 AND 5);
ALTER TABLE votes ADD CONSTRAINT comment_length CHECK (char_length(comment) <= 1000);
ALTER TABLE votes ADD CONSTRAINT valid_voting_method CHECK (voting_method IN ('web', 'sms', 'whatsapp', 'instagram', 'twitter'));

-- 5. UPDATE STORES RLS POLICIES TO BE CLEAR
-- Admin policy for unapproved stores
DROP POLICY IF EXISTS "Admins can view unapproved stores" ON public.stores;
CREATE POLICY "Admins can view unapproved stores"
ON public.stores
FOR SELECT
TO authenticated
USING (approved = false AND has_role(auth.uid(), 'admin'::app_role));