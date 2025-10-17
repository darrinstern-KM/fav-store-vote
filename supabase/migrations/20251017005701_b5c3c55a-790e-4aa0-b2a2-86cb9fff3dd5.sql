-- First, add 'organizing' to the allowed tier values
ALTER TABLE sponsors DROP CONSTRAINT IF EXISTS sponsors_tier_check;
ALTER TABLE sponsors ADD CONSTRAINT sponsors_tier_check 
  CHECK (tier = ANY (ARRAY['title'::text, 'presenting'::text, 'supporting'::text, 'partner'::text, 'organizing'::text]));

-- Update existing sponsors to organizing tier
UPDATE sponsors 
SET tier = 'organizing', 
    type = 'Organizing Sponsor'
WHERE name = 'h+h americas';

UPDATE sponsors 
SET tier = 'organizing', 
    type = 'Organizing Sponsor'
WHERE name = 'Fiber+Fabric Craft Festival';

-- Add Craft Industry Alliance as organizing sponsor
INSERT INTO sponsors (
  name, 
  type, 
  description, 
  website, 
  logo_url, 
  tier, 
  display_order, 
  active
) VALUES (
  'Craft Industry Alliance',
  'Organizing Sponsor',
  'A nonprofit trade association representing the creative industries, supporting craft retailers, manufacturers, and designers.',
  'https://craftindustryalliance.org/',
  '/lovable-uploads/cia-logo-wide.jpg',
  'organizing',
  3,
  true
);