import { useState, useEffect } from 'react';
import { LayoutDashboard, Utensils, FolderTree, Images, MessageSquare, Lightbulb, Settings, LogOut, Menu, X, Coffee, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import AdminOverview from './AdminOverview';
import MenuManager from './MenuManager';
import CategoryManager from './CategoryManager';
import GalleryManager from './GalleryManager';
import FeedbackManager from './FeedbackManager';
import SuggestionManager from './SuggestionManager';
import SettingsManager from './SettingsManager';

type AdminPage = 'overview' | 'menu' | 'categories' | 'gallery' | 'feedback' | 'suggestions' | 'settings';

export default function AdminDashboard() {
  const { signOut, user } = useAuth();
  const { t, lang, toggleLang } = useLanguage();
  const [page, setPage] = useState<AdminPage>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({ menuItems: 0, categories: 0, gallery: 0, feedback: 0, suggestions: 0 });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const navItems: { id: AdminPage; label_en: string; label_ar: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label_en: 'Dashboard', label_ar: 'الرئيسية', icon: LayoutDashboard },
    { id: 'menu', label_en: 'Menu Items', label_ar: 'أصناف القائمة', icon: Utensils },
    { id: 'categories', label_en: 'Categories', label_ar: 'الفئات', icon: FolderTree },
    { id: 'gallery', label_en: 'Gallery', label_ar: 'المعرض', icon: Images },
    { id: 'feedback', label_en: 'Feedback', label_ar: 'الملاحظات', icon: MessageSquare },
    { id: 'suggestions', label_en: 'Suggestions', label_ar: 'الاقتراحات', icon: Lightbulb },
    { id: 'settings', label_en: 'Settings', label_ar: 'الإعدادات', icon: Settings },
  ];

  // Fetch counts for sidebar badges
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [m, c, g, f, s] = await Promise.all([
          fetchCount('menu_items'),
          fetchCount('categories'),
          fetchCount('gallery_images'),
          fetchCount('feedback', 'is_reviewed=eq.false'),
          fetchCount('suggestions', 'is_reviewed=eq.false'),
        ]);
        if (!cancelled) setCounts({ menuItems: m, categories: c, gallery: g, feedback: f, suggestions: s });
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [page]);

  const badgeFor: Record<AdminPage, number> = {
    overview: 0, menu: counts.menuItems, categories: counts.categories,
    gallery: counts.gallery, feedback: counts.feedback, suggestions: counts.suggestions, settings: 0,
  };

  return (
    <div className="min-h-screen bg-cream-50 flex" dir={dir}>
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 z-40 h-screen w-64 bg-green-950 text-cream-100 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : (dir === 'rtl' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')
      }`}>
        <div className="flex items-center justify-between p-5 border-b border-green-800/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-green">
              <Coffee className="h-5 w-5 text-caramel-400" />
            </div>
            <div>
              <div className="font-display text-sm font-bold text-cream-50">VERO VITA</div>
              <div className="text-xs text-caramel-300">{t('Admin', 'الإدارة')}</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-cream-300 hover:text-cream-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = page === item.id;
            const badge = badgeFor[item.id];
            return (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? 'bg-caramel-500 text-cream-50 shadow-soft' : 'text-cream-200/70 hover:bg-green-900 hover:text-cream-50'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1 text-start">{t(item.label_en, item.label_ar)}</span>
                {badge > 0 && (item.id === 'feedback' || item.id === 'suggestions') && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-green-800/50 space-y-1">
          <a href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-cream-200/70 hover:bg-green-900 hover:text-cream-50 transition-all">
            <ExternalLink className="h-5 w-5" />
            {t('View Website', 'عرض الموقع')}
          </a>
          <button onClick={toggleLang} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-cream-200/70 hover:bg-green-900 hover:text-cream-50 transition-all">
            <span>{lang === 'ar' ? '🇬🇧 English' : '🇯🇬 العربية'}</span>
          </button>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-300 hover:bg-red-500/10 transition-all">
            <LogOut className="h-5 w-5" />
            {t('Sign Out', 'تسجيل الخروج')}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar (mobile) */}
        <div className="lg:hidden sticky top-0 z-20 glass border-b border-green-100 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display font-bold text-green-800">{t('Admin Dashboard', 'لوحة الإدارة')}</span>
          <div className="w-10" />
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {page === 'overview' && <AdminOverview onNavigate={setPage} />}
          {page === 'menu' && <MenuManager />}
          {page === 'categories' && <CategoryManager />}
          {page === 'gallery' && <GalleryManager />}
          {page === 'feedback' && <FeedbackManager />}
          {page === 'suggestions' && <SuggestionManager />}
          {page === 'settings' && <SettingsManager />}
        </main>
      </div>
    </div>
  );
}

async function fetchCount(table: string, query = ''): Promise<number> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/${table}?select=id&${query}`;
  const res = await fetch(url, {
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      Prefer: 'count=exact',
    },
  });
  const count = res.headers.get('content-range');
  if (count) {
    const parts = count.split('/');
    return parseInt(parts[1] || '0', 10);
  }
  const data = await res.json();
  return Array.isArray(data) ? data.length : 0;
}
