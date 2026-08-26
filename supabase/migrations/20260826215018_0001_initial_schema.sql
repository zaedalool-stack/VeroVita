/*
# VERO VITO — Initial Database Schema

## Overview
Creates the complete database architecture for the VERO VITO café website and admin dashboard.

## New Tables

1. **categories** — Menu categories (e.g. Fresh Cut Fruits, Cocktails, Coffee)
   - `id` (uuid PK)
   - `name_en` / `name_ar` (text) — bilingual category names
   - `sort_order` (int) — display ordering
   - `is_enabled` (bool) — toggle visibility
   - `created_at` (timestamptz)

2. **menu_items** — Individual products on the menu
   - `id` (uuid PK)
   - `category_id` (uuid FK → categories)
   - `name_en` / `name_ar` (text)
   - `description_en` / `description_ar` (text)
   - `price` (numeric, nullable — added later by admin)
   - `image_url` (text, nullable — individual image per item)
   - `image_alt` (text, nullable)
   - `sort_order` (int)
   - `is_enabled` (bool)
   - `created_at` (timestamptz)

3. **gallery_images** — Café/gallery photos (separate from menu item images)
   - `id` (uuid PK)
   - `image_url` (text)
   - `caption` / `alt_text` (text, nullable)
   - `sort_order` (int)
   - `created_at` (timestamptz)

4. **feedback** — Customer feedback (visible to admin only, never auto-published)
   - `id` (uuid PK)
   - `name` (text, nullable)
   - `message` (text)
   - `is_reviewed` (bool, default false)
   - `is_published` (bool, default false)
   - `created_at` (timestamptz)

5. **suggestions** — Customer suggestions (admin-only)
   - `id` (uuid PK)
   - `name` (text, nullable)
   - `message` (text)
   - `is_reviewed` (bool, default false)
   - `created_at` (timestamptz)

6. **site_settings** — Single-row table for business configuration
   - `id` (int PK, always 1)
   - `business_name` (text)
   - `phone` (text)
   - `whatsapp` (text)
   - `talabat_url` (text)
   - `ashiai_url` (text)
   - `google_maps_url` (text)
   - `about_en` / `about_ar` (text)
   - `hero_title_en` / `hero_title_ar` (text)
   - `hero_tagline_en` / `hero_tagline_ar` (text)
   - `logo_url` (text, nullable)
   - `updated_at` (timestamptz)

## Security (RLS)

This app has an admin sign-in screen, so:
- **Public tables** (categories, menu_items, gallery_images, site_settings, feedback INSERT, suggestions INSERT):
  SELECT is open to `anon, authenticated` so the public website works without login.
- **Admin-only data** (feedback/suggestions SELECT/UPDATE/DELETE, all writes to categories/menu_items/gallery_images/site_settings):
  Scoped to `authenticated` only — only logged-in admins can read or modify.
- Feedback and suggestions can be INSERTed by anon (customers submit), but only admin can read/update/delete them.

## Notes
- Menu items do NOT have prices or images initially (both nullable).
- Each menu item has its own single image_url field for individual upload.
- Gallery images are separate from menu item images.
- site_settings is a single-row table enforced by a constraint.
*/

-- ============ CATEGORIES ============
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_categories" ON categories;
CREATE POLICY "admin_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_categories" ON categories;
CREATE POLICY "admin_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_categories" ON categories;
CREATE POLICY "admin_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- ============ MENU ITEMS ============
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name_en text NOT NULL,
  name_ar text NOT NULL,
  description_en text,
  description_ar text,
  price numeric(10,2),
  image_url text,
  image_alt text,
  sort_order int NOT NULL DEFAULT 0,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_sort ON menu_items(sort_order);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_menu_items" ON menu_items;
CREATE POLICY "public_read_menu_items" ON menu_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_menu_items" ON menu_items;
CREATE POLICY "admin_insert_menu_items" ON menu_items FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_menu_items" ON menu_items;
CREATE POLICY "admin_update_menu_items" ON menu_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_menu_items" ON menu_items;
CREATE POLICY "admin_delete_menu_items" ON menu_items FOR DELETE
  TO authenticated USING (true);

-- ============ GALLERY IMAGES ============
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text,
  alt_text text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery" ON gallery_images;
CREATE POLICY "public_read_gallery" ON gallery_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_gallery" ON gallery_images;
CREATE POLICY "admin_insert_gallery" ON gallery_images FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_gallery" ON gallery_images;
CREATE POLICY "admin_update_gallery" ON gallery_images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_gallery" ON gallery_images;
CREATE POLICY "admin_delete_gallery" ON gallery_images FOR DELETE
  TO authenticated USING (true);

-- ============ FEEDBACK ============
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  message text NOT NULL,
  is_reviewed boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Public can submit feedback (INSERT only, no SELECT)
DROP POLICY IF EXISTS "public_insert_feedback" ON feedback;
CREATE POLICY "public_insert_feedback" ON feedback FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only admin can read feedback
DROP POLICY IF EXISTS "admin_read_feedback" ON feedback;
CREATE POLICY "admin_read_feedback" ON feedback FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_feedback" ON feedback;
CREATE POLICY "admin_update_feedback" ON feedback FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_feedback" ON feedback;
CREATE POLICY "admin_delete_feedback" ON feedback FOR DELETE
  TO authenticated USING (true);

-- ============ SUGGESTIONS ============
CREATE TABLE IF NOT EXISTS suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  message text NOT NULL,
  is_reviewed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_suggestions" ON suggestions;
CREATE POLICY "public_insert_suggestions" ON suggestions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_suggestions" ON suggestions;
CREATE POLICY "admin_read_suggestions" ON suggestions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_suggestions" ON suggestions;
CREATE POLICY "admin_update_suggestions" ON suggestions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_suggestions" ON suggestions;
CREATE POLICY "admin_delete_suggestions" ON suggestions FOR DELETE
  TO authenticated USING (true);

-- ============ SITE SETTINGS (single row) ============
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  business_name text NOT NULL DEFAULT 'VERO VITO',
  phone text NOT NULL DEFAULT '+962793434777',
  whatsapp text NOT NULL DEFAULT '962793434777',
  talabat_url text NOT NULL DEFAULT 'https://www.talabat.com/jordan/vero',
  ashiai_url text NOT NULL DEFAULT 'https://mythings.app/share/Vendor/Jordan/Vero-Vita',
  google_maps_url text NOT NULL DEFAULT 'https://maps.app.goo.gl/pHWnSWaEMwkpdCZn9',
  about_en text NOT NULL DEFAULT '',
  about_ar text NOT NULL DEFAULT 'VERO Vita Café | فيرو فيتا كافيه في طبربور - عمان

نحن كافيه في عمان نقوم بتقديم ، القهوة التركية على الرمل، القهوة الفرنسية على الرمل، الإسبريسو، اللاتيه، الكابتشينو، الآيس كوفي، الآيس لاتيه، الإسباني لاتيه، الموهيتو، الميلك شيك، الفرابتشينو، العصائر الطبيعية الطازجة، الكوكتيلات، السموذي، الوافل، الكريب، والحلويات. تستخدم مكونات عالية الجودة لتقدم مشروبات باردة وساخنة بطعم مميز.',
  hero_title_en text NOT NULL DEFAULT 'VERO VITO',
  hero_title_ar text NOT NULL DEFAULT 'فيرو فيتو',
  hero_tagline_en text NOT NULL DEFAULT 'Fresh drinks, premium ingredients, and unforgettable desserts — a modern café experience crafted with care.',
  hero_tagline_ar text NOT NULL DEFAULT 'مشروبات طازجة، مكونات فاخرة، وحلويات لا تُنسى — تجربة كافيه عصرية بصناعة متقنة.',
  logo_url text,
  seo_title_en text NOT NULL DEFAULT 'VERO VITO — Drinks, Dessert and More | Café in Amman',
  seo_title_ar text NOT NULL DEFAULT 'فيرو فيتو — مشروبات وحلويات والمزيد | كافيه في عمان',
  seo_description_en text NOT NULL DEFAULT 'VERO VITO café in Tabarbour, Amman. Fresh juices, cocktails, coffee, milkshakes, mojitos, waffles, crepes, and desserts. Order directly or via Talabat & Ashiai.',
  seo_description_ar text NOT NULL DEFAULT 'كافيه فيرو فيتو في طبربور - عمان. عصائر طبيعية طازجة، كوكتيلات، قهوة، ميلك شيك، موهيتو، وافل، كريب، وحلويات. اطلب مباشرة أو عبر طلبات وأشيائي.',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read site settings
DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

-- Only admin can update settings
DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Insert the single default row if it doesn't exist
INSERT INTO site_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;
