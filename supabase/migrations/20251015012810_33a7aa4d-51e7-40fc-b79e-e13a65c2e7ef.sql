-- Create sponsors table
CREATE TABLE public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('title', 'presenting', 'supporting', 'partner')),
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active sponsors
CREATE POLICY "Anyone can view active sponsors"
  ON public.sponsors
  FOR SELECT
  USING (active = true);

-- Admins can view all sponsors
CREATE POLICY "Admins can view all sponsors"
  ON public.sponsors
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Admins can insert sponsors
CREATE POLICY "Admins can insert sponsors"
  ON public.sponsors
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update sponsors
CREATE POLICY "Admins can update sponsors"
  ON public.sponsors
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Admins can delete sponsors
CREATE POLICY "Admins can delete sponsors"
  ON public.sponsors
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Create index for better query performance
CREATE INDEX idx_sponsors_active ON public.sponsors(active);
CREATE INDEX idx_sponsors_display_order ON public.sponsors(display_order);

-- Add trigger for updated_at
CREATE TRIGGER update_sponsors_updated_at
  BEFORE UPDATE ON public.sponsors
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Insert existing sponsors
INSERT INTO public.sponsors (name, type, description, website, logo_url, tier, display_order, active) VALUES
('h+h americas', 'Title Sponsor', 'Leading trade fair organizer for the international handicraft and hobby industry. h+h americas brings together creative communities and innovative businesses.', 'https://www.hh-americas.com', '/lovable-uploads/3bd255e3-a72d-40f7-8ed5-1247212390a5.png', 'title', 1, true),
('Fiber+Fabric Craft Festival', 'Presenting Sponsor', 'Premier craft festival celebrating fiber arts, quilting, and fabric crafts. Connecting makers with inspiration and quality materials.', 'https://www.fiberfabric.com', '/lovable-uploads/d80dca82-3afa-455c-a057-33f1f6967df0.png', 'presenting', 2, true);