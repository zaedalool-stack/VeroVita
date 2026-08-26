import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, Trash2, MessageSquare, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import type { Feedback } from '@/types';

export default function FeedbackManager() {
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewed'>('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('feedback').select('*').order('created_at', { ascending: false });
    if (filter === 'new') query = query.eq('is_reviewed', false);
    if (filter === 'reviewed') query = query.eq('is_reviewed', true);
    const { data } = await query;
    setItems(data ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const markReviewed = async (item: Feedback) => {
    const { error } = await supabase.from('feedback').update({ is_reviewed: !item.is_reviewed }).eq('id', item.id);
    if (error) { showToast(t('Failed to update', 'فشل التحديث'), 'error'); return; }
    fetchData();
  };

  const togglePublish = async (item: Feedback) => {
    const { error } = await supabase.from('feedback').update({ is_published: !item.is_published, is_reviewed: true }).eq('id', item.id);
    if (error) { showToast(t('Failed to update', 'فشل التحديث'), 'error'); return; }
    showToast(item.is_published ? t('Unpublished', 'تم إلغاء النشر') : t('Published', 'تم النشر'));
    fetchData();
  };

  const handleDelete = async (item: Feedback) => {
    if (!confirm(t('Delete this feedback?', 'حذف هذه الملاحظة؟'))) return;
    const { error } = await supabase.from('feedback').delete().eq('id', item.id);
    if (error) { showToast(t('Failed to delete', 'فشل الحذف'), 'error'); return; }
    showToast(t('Deleted', 'تم الحذف'));
    fetchData();
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-JO' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  if (loading) return <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-green-800">{t('Feedback', 'الملاحظات')}</h1>
          <p className="text-sm text-green-600/70 mt-1">{items.length} {t('entries', 'إدخالات')}</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'new', 'reviewed'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${filter === f ? 'bg-green-600 text-cream-50' : 'bg-white text-green-700 hover:bg-green-50 border border-green-100'}`}>
              {f === 'all' ? t('All', 'الكل') : f === 'new' ? t('New', 'جديد') : t('Reviewed', 'تمت المراجعة')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className={`card p-5 ${!item.is_reviewed ? 'border-l-4 border-l-caramel-400' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-green-800 text-sm">{item.name || t('Anonymous', 'مجهول')}</span>
                  <span className="text-xs text-green-400">• {fmtDate(item.created_at)}</span>
                  {!item.is_reviewed && <span className="badge-caramel text-[10px]">{t('New', 'جديد')}</span>}
                  {item.is_published && <span className="badge-green text-[10px]">{t('Published', 'منشور')}</span>}
                </div>
                <p className="text-sm text-green-700/80 leading-relaxed">{item.message}</p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button onClick={() => markReviewed(item)} title={t('Toggle reviewed', 'تبديل المراجعة')} className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${item.is_reviewed ? 'bg-green-100 text-green-600' : 'bg-cream-100 text-green-400'}`}>
                  <CheckCircle className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(item)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-16">
          <MessageSquare className="h-12 w-12 text-green-300 mx-auto mb-3" />
          <p className="text-green-600 font-semibold">{t('No feedback yet', 'لا توجد ملاحظات')}</p>
        </div>
      )}
    </div>
  );
}
