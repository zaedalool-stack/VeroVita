import { useEffect, useState, useCallback } from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import type { Category, MenuItem, GalleryImage, SiteSettings } from '@/types';

import Header from '@/components/public/Header';
import Hero from '@/components/public/Hero';
import About from '@/components/public/About';
import MenuSection from '@/components/public/MenuSection';
import Order from '@/components/public/Order';
import Contact from '@/components/public/Contact';
import Location from '@/components/public/Location';
import Gallery from '@/components/public/Gallery';
import FeedbackSuggestions from '@/components/public/FeedbackSuggestions';
import Footer from '@/components/public/Footer';
import FloatingActions from '@/components/public/FloatingActions';

import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

function AppContent() {
  const { session, loading } = useAuth();
  const isAdminRoute = window.location.hash === '#admin' || window.location.pathname.startsWith('/admin');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-green-200 border-t-green-600 animate-spin" />
          <p className="text-sm text-green-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAdminRoute) {
    if (!session) return <AdminLogin />;
    return <AdminDashboard />;
  }

  return <PublicSite />;
}

function PublicSite() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [settingsRes, catsRes, itemsRes, galleryRes] = await Promise.all([
      supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('menu_items').select('*').order('sort_order'),
      supabase.from('gallery_images').select('*').order('sort_order'),
    ]);
    setSettings(settingsRes.data);
    setCategories(catsRes.data ?? []);
    setMenuItems(itemsRes.data ?? []);
    setGalleryImages(galleryRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Update document title from settings
  useEffect(() => {
    if (settings) {
      document.title = settings.seo_title_en;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', settings.seo_description_en);
    }
  }, [settings]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-green-200 border-t-green-600 animate-spin" />
          <p className="text-sm text-green-600 font-semibold">VERO VITA</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Header settings={settings} />
      <main>
        <Hero settings={settings} />
        <About settings={settings} />
        <MenuSection categories={categories} menuItems={menuItems} />
        <Order settings={settings} />
        <Gallery images={galleryImages} />
        <Contact settings={settings} />
        <Location settings={settings} />
        <FeedbackSuggestions />
      </main>
      <Footer settings={settings} />
      <FloatingActions settings={settings} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
