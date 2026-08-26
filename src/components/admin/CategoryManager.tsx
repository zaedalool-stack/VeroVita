import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, GripVertical, Eye, EyeOff, FolderTree, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types';

export default function CategoryManager() {
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setCategories(data ?? []);
    if (data && data.length > 0) {
      const counts: Record<string, number> = {};
      for (const c of data) {
        const { count } = await supabase.from('menu_items').select('id', { count: 'exact', head: true }).eq('category_id', c.id);
        counts[c.id] = count ?? 0;
      }
      setItemCounts(counts);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (cat: Category) => {
    const count = itemCounts[cat.id] ?? 0;
    const msg = count > 0
      ? t(`This category has ${count} items. Delete anyway? Items will be deleted too.`, `هذه الفئة تحتوي على ${count} صنف. حذف مع ذلك؟ سيتم حذف الأصناف أيضاً.`)
      : t('Delete this category?', 'حذف هذه الفئة؟');
    if (!confirm(msg)) return;
    const { error } = await supabase.from('categories').delete().eq('id', cat.id);
    if (error) { showToast(t('Failed to delete', 'فشل الحذف'), 'error'); return; }
    showToast(t('Category deleted', 'تم الحذف'));
    fetchData();
  };

  const toggleEnabled = async (cat: Category) => {
    const { error } = await supabase.from('categories').update({ is_enabled: !cat.is_enabled }).eq('id', cat.id);
    if (error) { showToast(t('Failed to update', 'فشل التحديث'), 'error'); return; }
    fetchData();
  };

  if (loading) return <div className="grid sm:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-green-800">{t('Categories', 'الفئات')}</h1>
          <p className="text-sm text-green-600/70 mt-1">{categories.length} {t('categories', 'فئات')}</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">
          <Plus className="h-4 w-4" />
          {t('Add Category', 'إضافة فئة')}
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="card p-4 flex items-center gap-4 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-300 flex-shrink-0">
              <GripVertical className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-green-800">{lang === 'ar' ? cat.name_ar : cat.name_en}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-green-500">{lang === 'ar' ? cat.name_en : cat.name_ar}</span>
                <span className="text-green-300">•</span>
                <span className="text-xs text-caramel-600 font-semibold">{itemCounts[cat.id] ?? 0} {t('items', 'صنف')}</span>
                <span className="text-green-300">•</span>
                <span className="text-xs text-green-400">#{cat.sort_order}</span>
              </div>
            </div>
            <button onClick={() => toggleEnabled(cat)} className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${cat.is_enabled ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`}>
              {cat.is_enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <button onClick={() => { setEditing(cat); setShowForm(true); }} className="flex h-9 w-9 items-center justify-center rounded-lg bg-caramel-50 text-caramel-600 hover:bg-caramel-100">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={() => handleDelete(cat)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16">
          <FolderTree className="h-12 w-12 text-green-300 mx-auto mb-3" />
          <p className="text-green-600 font-semibold">{t('No categories yet', 'لا توجد فئات')}</p>
        </div>
      )}

      {showForm && (
        <CategoryForm category={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSaved={() => { setShowForm(false); setEditing(null); fetchData(); }} />
      )}
    </div>
  );
}

function CategoryForm({ category, onClose, onSaved }: { category: Category | null; onClose: () => void; onSaved: () => void }) {
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const [nameEn, setNameEn] = useState(category?.name_en ?? '');
  const [nameAr, setNameAr] = useState(category?.name_ar ?? '');
  const [sortOrder, setSortOrder] = useState(category?.sort_order ?? 0);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!nameEn.trim() || !nameAr.trim()) {
      showToast(t('Name required in both languages', 'الاسم مطلوب باللغتين'), 'warning');
      return;
    }
    setSaving(true);
    const payload = { name_en: nameEn.trim(), name_ar: nameAr.trim(), sort_order: sortOrder };
    const { error } = category
      ? await supabase.from('categories').update(payload).eq('id', category.id)
      : await supabase.from('categories').insert(payload);
    setSaving(false);
    if (error) { showToast(t('Failed to save', 'فشل الحفظ'), 'error'); return; }
    showToast(category ? t('Category updated', 'تم التحديث') : t('Category added', 'تمت الإضافة'));
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl shadow-premium w-full max-w-md">
        <div className="border-b border-green-50 px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-green-800">{category ? t('Edit Category', 'تعديل فئة') : t('Add Category', 'إضافة فئة')}</h2>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-cream-100"><X className="h-5 w-5 text-green-600" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="label">{t('Name (English)', 'الاسم (إنجليزي)')} *</label>
            <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">{t('Name (Arabic)', 'الاسم (عربي)')} *</label>
            <input value={nameAr} onChange={(e) => setNameAr(e.target.value)} className="input" dir="rtl" />
          </div>
          <div>
            <label className="label">{t('Sort Order', 'ترتيب العرض')}</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} className="input" />
          </div>
        </div>
        <div className="border-t border-green-50 px-6 py-4 flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn-ghost">{t('Cancel', 'إلغاء')}</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t('Save', 'حفظ')}
          </button>
        </div>
      </div>
    </div>
  );
}
