/*
# Fix brand name: VERO VITO → VERO VITA

## Overview
Corrects the brand name in site_settings defaults and stored data.
- business_name: VERO VITO → VERO VITA
- hero_title_en: VERO VITO → VERO VITA
- hero_title_ar: فيرو فيتو → فيرو فيتا
- seo_title_en: VERO VITO → VERO VITA
- seo_title_ar: فيرو فيتو → فيرو فيتا
- seo_description_en: VERO VITO → VERO VITA
- seo_description_ar: فيرو فيتو → فيرو فيتا

## Security
No security changes — data-only update.
*/

UPDATE site_settings
SET
  business_name = 'VERO VITA',
  hero_title_en = 'VERO VITA',
  hero_title_ar = 'فيرو فيتا',
  seo_title_en = 'VERO VITA — Drinks, Dessert and More | Café in Amman',
  seo_title_ar = 'فيرو فيتا — مشروبات وحلويات والمزيد | كافيه في عمان',
  seo_description_en = 'VERO VITA café in Tabarbour, Amman. Fresh juices, cocktails, coffee, milkshakes, mojitos, waffles, crepes, and desserts. Order directly or via Talabat & Ashiai.',
  seo_description_ar = 'كافيه فيرو فيتا في طبربور - عمان. عصائر طبيعية طازجة، كوكتيلات، قهوة، ميلك شيك، موهيتو، وافل، كريب، وحلويات. اطلب مباشرة أو عبر طلبات وأشيائي.',
  updated_at = now()
WHERE id = 1;
