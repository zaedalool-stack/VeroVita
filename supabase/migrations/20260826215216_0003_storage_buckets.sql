/*
# Create Storage Buckets

## Overview
Creates two storage buckets:
1. **menu-images** — for individual menu item images (one per item)
2. **gallery-images** — for café/gallery photos

## Security
- Public read access for both buckets (visitors need to see images)
- Authenticated write access (only admin can upload/modify)
*/

INSERT INTO storage.buckets (id, name, public) VALUES
  ('menu-images', 'menu-images', true),
  ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for both buckets
DROP POLICY IF EXISTS "public_read_menu_images" ON storage.objects;
CREATE POLICY "public_read_menu_images" ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "public_read_gallery_images" ON storage.objects;
CREATE POLICY "public_read_gallery_images" ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'gallery-images');

-- Admin write for menu images
DROP POLICY IF EXISTS "admin_insert_menu_images" ON storage.objects;
CREATE POLICY "admin_insert_menu_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "admin_update_menu_images" ON storage.objects;
CREATE POLICY "admin_update_menu_images" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'menu-images') WITH CHECK (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "admin_delete_menu_images" ON storage.objects;
CREATE POLICY "admin_delete_menu_images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'menu-images');

-- Admin write for gallery images
DROP POLICY IF EXISTS "admin_insert_gallery_images" ON storage.objects;
CREATE POLICY "admin_insert_gallery_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'gallery-images');

DROP POLICY IF EXISTS "admin_update_gallery_images" ON storage.objects;
CREATE POLICY "admin_update_gallery_images" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'gallery-images') WITH CHECK (bucket_id = 'gallery-images');

DROP POLICY IF EXISTS "admin_delete_gallery_images" ON storage.objects;
CREATE POLICY "admin_delete_gallery_images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'gallery-images');