import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Search, ImageIcon, Upload, Loader2, GripVertical, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import type { Category, MenuItem } from '@/types';

export default function MenuManager() {
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [itemsRes, catsRes] = await Promise.all([
      supabase.from('menu_items').select('*').order('sort_order'),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    setItems(itemsRes.data ?? []);
    setCategories(catsRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = items.filter((i) => {
    if (filterCat !== 'all' && i.category_id !== filterCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return i.name_en.toLowerCase().includes(q) || i.name_ar.includes(q);
    }
    return true;
  });

  const catName = (id: string) => {
    const c = categories.find((c) => c.id === id);
    return c ? (lang === 'ar' ? c.name_ar : c.name_en) : '';
  };

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(t('Delete this menu item?', 'حذف هذا الصنف؟'))) return;
    if (item.image_url) {
      const path = item.image_url.split('/menu-images/')[1];
      if (path) await supabase.storage.from('menu-images').remove([path]);
    }
    const { error } = await supabase.from('menu_items').delete().eq('id', item.id);
    if (error) { showToast(t('Failed to delete', 'فشل الحذف'), 'error'); return; }
    showToast(t('Item deleted', 'تم الحذف'));
    fetchData();
  };

  const toggleEnabled = async (item: MenuItem) => {
    const { error } = await supabase.from('menu_items').update({ is_enabled: !item.is_enabled }).eq('id', item.id);
    if (error) { showToast(t('Failed to update', 'فشل التحديث'), 'error'); return; }
    fetchData();
  };

  if (loading) {
    return <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-green-800">{t('Menu Items', 'أصناف القائمة')}</h1>
          <p className="text-sm text-green-600/70 mt-1">{items.length} {t('items', 'صنف')}</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">
          <Plus className="h-4 w-4" />
          {t('Add Item', 'إضافة صنف')}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 left-4 h-5 w-5 text-green-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('Search...', 'بحث...')} className="input pl-12" />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="input sm:w-56">
          <option value="all">{t('All Categories', 'كل الفئات')}</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
        </select>
      </div>

      {/* Items grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="card overflow-hidden group">
            {item.image_url ? (
              <div className="aspect-[4/3] overflow-hidden bg-cream-100">
                <img src={item.image_url} alt={item.image_alt || ''} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-cream-100 flex items-center justify-center">
                <ImageIcon className="h-10 w-10 text-green-300" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-green-800 text-sm flex-1 leading-snug">{lang === 'ar' ? item.name_ar : item.name_en}</h3>
                <span className="badge-green flex-shrink-0 text-[10px]">{catName(item.category_id)}</span>
              </div>
              <p className="text-xs text-green-600/60 line-clamp-2 mb-3">{lang === 'ar' ? item.description_ar : item.description_en}</p>
              <div className="flex items-center justify-between gap-2">
                <button onClick={() => toggleEnabled(item)} className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${item.is_enabled ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`}>
                  {item.is_enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {item.is_enabled ? t('Visible', 'ظاهر') : t('Hidden', 'مخفي')}
                </button>
                <div className="flex gap-1.5">
                  <button onClick={() => { setEditing(item); setShowForm(true); }} className="flex h-8 w-8 items-center justify-center rounded-lg bg-caramel-50 text-caramel-600 hover:bg-caramel-100 transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(item)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <ImageIcon className="h-12 w-12 text-green-300 mx-auto mb-3" />
          <p className="text-green-600 font-semibold">{t('No items found', 'لا توجد أصناف')}</p>
        </div>
      )}

      {showForm && (
        <MenuItemForm
          item={editing}
          categories={categories}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); fetchData(); }}
        />
      )}
    </div>
  );
}

interface MenuItemFormProps {
  item: MenuItem | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

function MenuItemForm({ item, categories, onClose, onSaved }: MenuItemFormProps) {
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const [nameEn, setNameEn] = useState(item?.name_en ?? '');
  const [nameAr, setNameAr] = useState(item?.name_ar ?? '');
  const [descEn, setDescEn] = useState(item?.description_en ?? '');
  const [descAr, setDescAr] = useState(item?.description_ar ?? '');
  const [categoryId, setCategoryId] = useState(item?.category_id ?? categories[0]?.id ?? '');
  const [price, setPrice] = useState(item?.price?.toString() ?? '');
  const [sortOrder, setSortOrder] = useState(item?.sort_order ?? 0);
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? null);
  const [imageAlt, setImageAlt] = useState(item?.image_alt ?? '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('menu-images').upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from('menu-images').getPublicUrl(fileName);
      setImageUrl(urlData.publicUrl);
      showToast(t('Image uploaded', 'تم رفع الصورة'));
    } catch {
      showToast(t('Upload failed', 'فشل الرفع'), 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (imageUrl) {
      const path = imageUrl.split('/menu-images/')[1];
      if (path) await supabase.storage.from('menu-images').remove([path]);
    }
    setImageUrl(null);
  };

  const handleSave = async () => {
    if (!nameEn.trim() || !nameAr.trim()) {
      showToast(t('Name is required in both languages', 'الاسم مطلوب باللغتين'), 'warning');
      return;
    }
    if (!categoryId) {
      showToast(t('Please select a category', 'يرجى اختيار فئة'), 'warning');
      return;
    }

    setSaving(true);
    const payload = {
      name_en: nameEn.trim(),
      name_ar: nameAr.trim(),
      description_en: descEn.trim() || null,
      description_ar: descAr.trim() || null,
      category_id: categoryId,
      price: price ? parseFloat(price) : null,
      sort_order: sortOrder,
      image_url: imageUrl,
      image_alt: imageAlt.trim() || null,
    };

    const { error } = item
      ? await supabase.from('menu_items').update(payload).eq('id', item.id)
      : await supabase.from('menu_items').insert(payload);

    setSaving(false);
    if (error) { showToast(t('Failed to save', 'فشل الحفظ'), 'error'); return; }
    showToast(item ? t('Item updated', 'تم التحديث') : t('Item added', 'تمت الإضافة'));
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl shadow-premium w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-green-50 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-display text-xl font-bold text-green-800">
            {item ? t('Edit Item', 'تعديل الصنف') : t('Add New Item', 'إضافة صنف جديد')}
          </h2>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-cream-100">
            <X className="h-5 w-5 text-green-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Image upload */}
          <div>
            <label className="label">{t('Item Image', 'صورة الصنف')}</label>
            {imageUrl ? (
              <div className="relative rounded-xl overflow-hidden group">
                <img src={imageUrl} alt={imageAlt} className="w-full h-48 object-cover" />
                <button onClick={handleRemoveImage} className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white opacity-90 hover:opacity-100">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 h-48 rounded-xl border-2 border-dashed border-green-200 bg-cream-50 cursor-pointer hover:border-caramel-400 transition-colors">
                {uploading ? <Loader2 className="h-8 w-8 text-green-400 animate-spin" /> : <Upload className="h-8 w-8 text-green-300" />}
                <span className="text-sm text-green-500">{uploading ? t('Uploading...', 'جار الرفع...') : t('Click to upload image', 'انقر لرفع صورة')}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
              </label>
            )}
            <input value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} placeholder={t('Image alt text (for SEO)', 'نص بديل للصورة (SEO)')} className="input mt-2 text-sm" />
          </div>

          {/* Category */}
          <div>
            <label className="label">{t('Category', 'الفئة')} *</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input">
              {categories.map((c) => <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>)}
            </select>
          </div>

          {/* Names */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">{t('Name (English)', 'الاسم (إنجليزي)')} *</label>
              <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">{t('Name (Arabic)', 'الاسم (عربي)')} *</label>
              <input value={nameAr} onChange={(e) => setNameAr(e.target.value)} className="input" dir="rtl" />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">{t('Description (English)', 'الوصف (إنجليزي)')}</label>
              <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} className="input min-h-[80px]" />
            </div>
            <div>
              <label className="label">{t('Description (Arabic)', 'الوصف (عربي)')}</label>
              <textarea value={descAr} onChange={(e) => setDescAr(e.target.value)} className="input min-h-[80px]" dir="rtl" />
            </div>
          </div>

          {/* Price + sort */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">{t('Price (JOD) — optional', 'السعر (د.أ) — اختياري')}</label>
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="input" placeholder="0.00" />
            </div>
            <div>
              <label className="label">{t('Sort Order', 'ترتيب العرض')}</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} className="input" />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-green-50 px-6 py-4 flex items-center justify-end gap-3">
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
