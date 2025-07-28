-- Create stores table
CREATE TABLE stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  category VARCHAR(100) NOT NULL,
  approved BOOLEAN DEFAULT false,
  votes_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create users table  
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create votes table
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  voting_method VARCHAR(50) DEFAULT 'web', -- 'web', 'sms', 'whatsapp', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, store_id) -- One vote per user per store
);

-- Create indexes for better performance
CREATE INDEX idx_stores_state_city ON stores(state, city);
CREATE INDEX idx_stores_zip_code ON stores(zip_code);
CREATE INDEX idx_stores_approved ON stores(approved);
CREATE INDEX idx_votes_store_id ON votes(store_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);

-- Enable Row Level Security
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stores
CREATE POLICY "Anyone can view approved stores" ON stores
  FOR SELECT USING (approved = true);

CREATE POLICY "Admins can view all stores" ON stores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.email = auth.jwt() ->> 'email' 
      AND users.is_admin = true
    )
  );

CREATE POLICY "Anyone can insert stores" ON stores
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update stores" ON stores
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.email = auth.jwt() ->> 'email' 
      AND users.is_admin = true
    )
  );

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Anyone can insert users" ON users
  FOR INSERT WITH CHECK (true);

-- RLS Policies for votes
CREATE POLICY "Anyone can view votes" ON votes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own votes" ON votes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = user_id 
      AND users.email = auth.jwt() ->> 'email'
    )
  );

-- Function to update vote counts and ratings
CREATE OR REPLACE FUNCTION update_store_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update vote count and average rating for the store
  UPDATE stores 
  SET 
    votes_count = (SELECT COUNT(*) FROM votes WHERE store_id = COALESCE(NEW.store_id, OLD.store_id)),
    rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM votes WHERE store_id = COALESCE(NEW.store_id, OLD.store_id) AND rating IS NOT NULL),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.store_id, OLD.store_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update store stats when votes change
CREATE TRIGGER update_store_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_store_stats();

-- Insert sample data
INSERT INTO users (email, zip_code, is_admin) VALUES 
('admin@example.com', '12345', true),
('user@example.com', '62701', false);

INSERT INTO stores (name, address, city, state, zip_code, category, approved, votes_count, rating) VALUES 
('Downtown Electronics', '123 Main St', 'Springfield', 'IL', '62701', 'Electronics', true, 1247, 4.8),
('Fashion Forward', '456 Oak Ave', 'Springfield', 'IL', '62702', 'Clothing', true, 1156, 4.7),
('Corner Pharmacy', '789 Pine St', 'Springfield', 'IL', '62703', 'Health & Wellness', true, 1089, 4.9),
('Texas BBQ House', '321 Lone Star Rd', 'Austin', 'TX', '73301', 'Food & Beverage', true, 892, 4.6),
('California Surf Shop', '789 Beach Blvd', 'Los Angeles', 'CA', '90210', 'Sports & Recreation', true, 756, 4.8);