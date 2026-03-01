-- ===== PawLife Supabase Schema =====
-- Run this in your Supabase SQL Editor to create all tables

-- Users (synced from Clerk via webhook)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pets
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT,
  breed TEXT,
  dob DATE,
  weight DECIMAL,
  gender TEXT,
  photo_url TEXT,
  microchip_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health Records
CREATE TABLE health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('vaccine', 'checkup', 'medication', 'surgery')),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  vet_name TEXT,
  notes TEXT,
  next_reminder DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lost & Found Reports
CREATE TABLE lost_found (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id),
  pet_name TEXT NOT NULL,
  species TEXT,
  description TEXT,
  photo_url TEXT,
  status TEXT DEFAULT 'lost' CHECK (status IN ('lost', 'found', 'resolved')),
  latitude DECIMAL,
  longitude DECIMAL,
  address TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social Posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id),
  pet_id UUID REFERENCES pets(id),
  image_url TEXT,
  caption TEXT,
  like_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post Likes
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Services Directory
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('vet', 'groomer', 'shop', 'walker')),
  address TEXT,
  phone TEXT,
  rating DECIMAL DEFAULT 0,
  review_count INT DEFAULT 0,
  photo_url TEXT,
  is_sponsored BOOLEAN DEFAULT FALSE,
  latitude DECIMAL,
  longitude DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT,
  price DECIMAL NOT NULL,
  original_price DECIMAL,
  category TEXT,
  description TEXT,
  image_url TEXT,
  rating DECIMAL DEFAULT 0,
  review_count INT DEFAULT 0,
  affiliate_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE lost_found ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (id = current_setting('request.jwt.claims')::json->>'sub');
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (id = current_setting('request.jwt.claims')::json->>'sub');

-- Users can CRUD their own pets
CREATE POLICY "Users can view own pets" ON pets FOR SELECT USING (user_id = current_setting('request.jwt.claims')::json->>'sub');
CREATE POLICY "Users can insert own pets" ON pets FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims')::json->>'sub');
CREATE POLICY "Users can update own pets" ON pets FOR UPDATE USING (user_id = current_setting('request.jwt.claims')::json->>'sub');
CREATE POLICY "Users can delete own pets" ON pets FOR DELETE USING (user_id = current_setting('request.jwt.claims')::json->>'sub');

-- Health records follow pet ownership
CREATE POLICY "Users can manage pet health" ON health_records FOR ALL USING (pet_id IN (SELECT id FROM pets WHERE user_id = current_setting('request.jwt.claims')::json->>'sub'));

-- Lost & Found is public read, user-owned write
CREATE POLICY "Anyone can view lost_found" ON lost_found FOR SELECT USING (true);
CREATE POLICY "Users can create reports" ON lost_found FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims')::json->>'sub');

-- Posts are public read
CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims')::json->>'sub');

-- Services and products are public read
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view services" ON services FOR SELECT USING (true);
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
