export type Language = 'en' | 'ar';

export interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  sort_order: number;
  is_enabled: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name_en: string;
  name_ar: string;
  description_en: string | null;
  description_ar: string | null;
  price: number | null;
  image_url: string | null;
  image_alt: string | null;
  sort_order: number;
  is_enabled: boolean;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface Feedback {
  id: string;
  name: string | null;
  message: string;
  is_reviewed: boolean;
  is_published: boolean;
  created_at: string;
}

export interface Suggestion {
  id: string;
  name: string | null;
  message: string;
  is_reviewed: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  business_name: string;
  phone: string;
  whatsapp: string;
  talabat_url: string;
  ashiai_url: string;
  google_maps_url: string;
  about_en: string;
  about_ar: string;
  hero_title_en: string;
  hero_title_ar: string;
  hero_tagline_en: string;
  hero_tagline_ar: string;
  logo_url: string | null;
  seo_title_en: string;
  seo_title_ar: string;
  seo_description_en: string;
  seo_description_ar: string;
  updated_at: string;
}

export interface CategoryWithItems extends Category {
  menu_items: MenuItem[];
}
