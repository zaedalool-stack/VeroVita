import { useEffect, useState } from 'react';
import { Utensils, FolderTree, Images, MessageSquare, Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

type AdminPage = 'overview' | 'menu' | 'categories' | 'gallery' | 'feedback' | 'suggestions' | 'settings';

interface AdminOverviewProps {
  onNavigate: (page: AdminPage) => void;
}

interface KpiData {
  menuItems: number;
  categories: number;
  gallery: number;
  feedback: number;
  suggestions: number;
}

export default function AdminOverview({ onNavigate }: AdminOverviewProps) {
  const { t } = useLanguage();
  const [data, setData] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [m, c, g, f, s] = await Promise.all([
          supabase.from('menu_items').select('id', { count: 'exact', head: true }),
          supabase.from('categories').select('id', { count: 'exact', head: true }),
          supabase.from('gallery_images').select('id', { count: 'exact', head: true }),
          supabase.from('feedback').select('id', { count: 'exact', head: true }).eq('is_reviewed', false),
          supabase.from('suggestions').select('id', { count: 'exact', head: true }).eq('is_reviewed', false),
        ]);
        setData({
          menuItems: m.count ?? 0,
          categories: c.count ?? 0,
          gallery: g.count ?? 0,
          feedback: f.count ?? 0,
          suggestions: s.count ?? 0,
        });
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  const kpis = [
    { label_en: 'Menu Items', label_ar: 'أصناف القائمة', value: data?.menuItems ?? 0, icon: Utensils, color: 'bg-green-600', page: 'menu' as AdminPage },
    { label_en: 'Categories', label_ar: 'الفئات', value: data?.categories ?? 0, icon: FolderTree, color: 'bg-caramel-500', page: 'categories' as AdminPage },
    { label_en: 'Gallery Images', label_ar: 'صور المعرض', value: data?.gallery ?? 0, icon: Images, color: 'bg-green-700', page: 'gallery' as AdminPage },
    { label_en: 'New Feedback', label_ar: 'ملاحظات جديدة', value: data?.feedback ?? 0, icon: MessageSquare, color: 'bg-caramel-600', page: 'feedback' as AdminPage, highlight: (data?.feedback ?? 0) > 0 },
    { label_en: 'New Suggestions', label_ar: 'اقتراحات جديدة', value: data?.suggestions ?? 0, icon: Lightbulb, color: 'bg-caramel-700', page: 'suggestions' as AdminPage, highlight: (data?.suggestions ?? 0) > 0 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-green-800">
          {t('Dashboard Overview', 'نظرة عامة')}
        </h1>
        <p className="text-sm text-green-600/70 mt-1">
          {t('Manage your café website from here', 'أدر موقع الكافيه من هنا')}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <button
              key={kpi.label_en}
              onClick={() => onNavigate(kpi.page)}
              className="card-hover p-6 text-start relative overflow-hidden group"
            >
              {kpi.highlight && (
                <span className="absolute top-4 right-4 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                </span>
              )}
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${kpi.color} text-cream-50 mb-4 transition-transform group-hover:scale-110`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-display font-bold text-green-800 mb-1">
                {kpi.value}
              </div>
              <div className="text-sm text-green-600/70 font-semibold flex items-center gap-1">
                {t(kpi.label_en, kpi.label_ar)}
                <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-180" />
              </div>
            </button>
          );
        })}

        {/* Quick actions card */}
        <div className="card p-6 bg-gradient-to-br from-green-50 to-cream-100 border-green-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-caramel-100 text-caramel-600 mb-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-green-800 mb-2">
            {t('Quick Actions', 'إجراءات سريعة')}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onNavigate('menu')} className="badge-green hover:bg-green-200 transition-colors cursor-pointer">
              {t('Add Item', 'إضافة صنف')}
            </button>
            <button onClick={() => onNavigate('gallery')} className="badge-caramel hover:bg-caramel-200 transition-colors cursor-pointer">
              {t('Add Photo', 'إضافة صورة')}
            </button>
            <button onClick={() => onNavigate('settings')} className="badge-cream hover:bg-cream-300 transition-colors cursor-pointer">
              {t('Settings', 'الإعدادات')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
