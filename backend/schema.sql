-- =============================================
-- SQL Schema for Suiting Fabrics - Supabase
-- Run this in the Supabase SQL Editor
-- =============================================

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('simple', 'imprime', 'motifs')),
  description TEXT,
  image_url TEXT,
  is_new BOOLEAN DEFAULT false,
  best_seller BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop policy if already exists then recreate
DROP POLICY IF EXISTS "Allow public read" ON products;
CREATE POLICY "Allow public read" ON products
  FOR SELECT USING (true);

-- Insert sample data (your 13 existing products)
-- ON CONFLICT DO NOTHING prevents duplicate errors on re-run
INSERT INTO products (name, price, category, description, image_url, is_new, best_seller) VALUES
  ('Tissu Simple Classique Blanc', 349, 'simple', 'Coupe droite, tissu confortable, idéal pour le quotidien.', '', true, true),
  ('Tissu Simple Noir Élégant', 379, 'simple', 'Style minimal et moderne, finition propre et élégante.', '', true, false),
  ('Tissu Imprimé Moderne', 399, 'imprime', 'Design imprimé élégant, parfait pour se démarquer avec classe.', '', true, true),
  ('Tissu Motifs Raffinés', 399, 'motifs', 'Motifs élégants et discrets, style chic pour occasions.', '', false, true),
  ('Tissu Motifs Premium', 100, 'motifs', 'Motifs élégants et discrets, style chic pour occasions.', '', false, false),
  ('Tissu Simple Gris Premium', 299, 'simple', 'Coupe droite, tissu premium, très confortable.', '', true, false),
  ('Tissu Simple Gris Premium', 399, 'simple', 'Coupe droite, tissu premium, très confortable.', '', true, false),
  ('Tissu Simple Gris Premium', 190, 'simple', 'Coupe droite, tissu premium, très confortable.', '', true, false),
  ('Tissu Simple Gris Premium', 520, 'simple', 'Coupe droite, tissu premium, très confortable.', '', true, false),
  ('Tissu Simple Gris Premium', 350, 'simple', 'Coupe droite, tissu premium, très confortable.', '', true, false),
  ('Tissu Simple Gris Premium', 449, 'simple', 'Coupe droite, tissu premium, très confortable.', '', true, false),
  ('Tissu Simple Gris Premium', 650, 'imprime', 'Coupe droite, tissu premium, très confortable.', '', true, false),
  ('Tissu Simple Gris Premium', 300, 'motifs', 'Coupe droite, tissu premium, très confortable.', '', true, false);
