-- Add voting_method column to votes table to track how the vote was submitted
ALTER TABLE public.votes ADD COLUMN voting_method TEXT DEFAULT 'website';

-- Add instagram_user_id column to track Instagram users
ALTER TABLE public.votes ADD COLUMN instagram_user_id TEXT;

-- Create index for Instagram user lookups
CREATE INDEX idx_votes_instagram_user ON public.votes(instagram_user_id);

-- Add constraint to ensure instagram_user_id is provided when voting_method is 'instagram'
ALTER TABLE public.votes ADD CONSTRAINT check_instagram_voting 
CHECK (
  (voting_method = 'instagram' AND instagram_user_id IS NOT NULL) OR 
  (voting_method != 'instagram')
);