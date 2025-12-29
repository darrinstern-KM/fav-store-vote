-- Add database constraints for server-side input validation
-- This prevents attackers from bypassing frontend validation
-- Note: Email format constraints skipped for stores due to legacy data

-- VOTES TABLE CONSTRAINTS (critical for security)

-- Add rating constraint to votes table (must be 1-5)
ALTER TABLE public.votes 
ADD CONSTRAINT votes_rating_range 
CHECK (rating >= 1 AND rating <= 5);

-- Add comment length constraint to votes table (max 1000 chars)
ALTER TABLE public.votes 
ADD CONSTRAINT votes_comment_length 
CHECK (comment IS NULL OR length(comment) <= 1000);

-- Add voter email format constraint (basic check)
ALTER TABLE public.votes 
ADD CONSTRAINT votes_email_format 
CHECK (voter_email IS NULL OR voter_email = '' OR voter_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add voter phone length constraint
ALTER TABLE public.votes 
ADD CONSTRAINT votes_phone_length 
CHECK (voter_phone IS NULL OR voter_phone = '' OR length(voter_phone) <= 20);

-- Add voter city length constraint
ALTER TABLE public.votes 
ADD CONSTRAINT votes_city_length 
CHECK (voter_city IS NULL OR length(voter_city) <= 100);

-- Add voter state length constraint (allow full names up to 20 chars)
ALTER TABLE public.votes 
ADD CONSTRAINT votes_state_length 
CHECK (voter_state IS NULL OR length(voter_state) <= 20);

-- STORES TABLE CONSTRAINTS (length limits only, to accommodate legacy data)

-- Add store name length constraint
ALTER TABLE public.stores 
ADD CONSTRAINT stores_name_length 
CHECK (length(shop_name) <= 200);

-- Add store city length constraint
ALTER TABLE public.stores 
ADD CONSTRAINT stores_city_length 
CHECK (shop_city IS NULL OR length(shop_city) <= 100);

-- Add store state length constraint (allow full state names)
ALTER TABLE public.stores 
ADD CONSTRAINT stores_state_length 
CHECK (shop_state IS NULL OR length(shop_state) <= 20);

-- Add store zip length constraint (allow ZIP+4 format)
ALTER TABLE public.stores 
ADD CONSTRAINT stores_zip_length 
CHECK (shop_zip IS NULL OR length(shop_zip) <= 10);

-- Add store address length constraint
ALTER TABLE public.stores 
ADD CONSTRAINT stores_address_length 
CHECK (shop_addr_1 IS NULL OR length(shop_addr_1) <= 200);

-- Add store website length constraint
ALTER TABLE public.stores 
ADD CONSTRAINT stores_website_length 
CHECK (shop_website IS NULL OR length(shop_website) <= 500);