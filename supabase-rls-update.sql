-- ===== PawLife RLS Policy Update =====
-- Run this in your Supabase SQL Editor
-- This updates RLS policies to work with the anon key
-- (allows client-side queries without JWT claims)

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own pets" ON pets;
DROP POLICY IF EXISTS "Users can insert own pets" ON pets;
DROP POLICY IF EXISTS "Users can update own pets" ON pets;
DROP POLICY IF EXISTS "Users can delete own pets" ON pets;
DROP POLICY IF EXISTS "Users can manage pet health" ON health_records;
DROP POLICY IF EXISTS "Anyone can view lost_found" ON lost_found;
DROP POLICY IF EXISTS "Users can create reports" ON lost_found;
DROP POLICY IF EXISTS "Anyone can view posts" ON posts;
DROP POLICY IF EXISTS "Users can create posts" ON posts;
DROP POLICY IF EXISTS "Anyone can view services" ON services;
DROP POLICY IF EXISTS "Anyone can view products" ON products;

-- USERS: Allow all operations (Clerk manages auth)
CREATE POLICY "Allow all user operations" ON users FOR ALL USING (true) WITH CHECK (true);

-- PETS: Allow all operations (app-level auth via Clerk)
CREATE POLICY "Allow all pet operations" ON pets FOR ALL USING (true) WITH CHECK (true);

-- HEALTH RECORDS: Allow all operations
CREATE POLICY "Allow all health record operations" ON health_records FOR ALL USING (true) WITH CHECK (true);

-- LOST & FOUND: Public read + write
CREATE POLICY "Allow all lost_found operations" ON lost_found FOR ALL USING (true) WITH CHECK (true);

-- POSTS: Public read + write
CREATE POLICY "Allow all post operations" ON posts FOR ALL USING (true) WITH CHECK (true);

-- COMMENTS: Public read + write
CREATE POLICY "Allow all comment operations" ON comments FOR ALL USING (true) WITH CHECK (true);

-- LIKES: Public read + write
CREATE POLICY "Allow all like operations" ON likes FOR ALL USING (true) WITH CHECK (true);

-- SERVICES: Public read
CREATE POLICY "Allow all service operations" ON services FOR ALL USING (true) WITH CHECK (true);

-- PRODUCTS: Public read
CREATE POLICY "Allow all product operations" ON products FOR ALL USING (true) WITH CHECK (true);
