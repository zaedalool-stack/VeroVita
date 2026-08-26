import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Upload, Loader2, Images, Pencil, X, GripVertical } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import type { GalleryImage } from '@/types';

export default function GalleryManager() {
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('gallery_images').select('*').order('sort_order');
    setImages(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('gallery-images').upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (upErr) { showToast(t('Upload failed', 'فشل الرفع'), 'error'); continue; }
      const { data: urlData } = supabase.storage.from('gallery-images').getPublicUrl(fileName);
      await supabase.from('gallery_images').insert({ image_url: urlData.publicUrl, sort_order: images.length });
    }
    setUploading(false);
    showToast(t('Images uploaded', 'تم رفع الصور'));
    fetchData();
  };

  const handleDelete = async (img: GalleryImage) => {
    if (!confirm(t('Delete this image?', 'حذف هذه الصورة؟'))) return;
    const path = img.image_url.split('/gallery-images/')[1];
    if (path) await supabase.storage.from('gallery-images').remove([path]);
    const { error } = await supabase.from('gallery_images').delete().eq('id', img.id);
    if (error) { showToast(t('Failed to delete', 'فشل الحذف'), 'error'); return; }
    showToast(t('Image deleted', 'تم الحذف'));
    fetchData();
  };

  if (loading) return <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-green-800">{t('Gallery', 'المعرض')}</h1>
          <p className="text-sm text-green-600/70 mt-1">{images.length} {t('images', 'صور')}</p>
        </div>
      </div>

      {/* Upload area */}
      <label className="flex flex-col items-center justify-center gap-2 h-40 rounded-2xl border-2 border-dashed border-green-200 bg-cream-50 cursor-pointer hover:border-caramel-400 transition-colors mb-6">
        {uploading ? <Loader2 className="h-8 w-8 text-green-400 animate-spin" /> : <Upload className="h-8 w-8 text-green-300" />}
        <span className="text-sm text-green-500 font-semibold">{uploading ? t('Uploading...', 'جار الرفع...') : t('Click to upload café photos', 'انقر لرفع صور الكافيه')}</span>
        <span className="text-xs text-green-400">{t('You can select multiple images', 'يمكنك اختيار عدة صور')}</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files?.length) handleUpload(e.target.files); }} />
      </label>

      {/* Gallery grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="card overflow-hidden group">
            <div className="aspect-square overflow-hidden bg-cream-100">
              <img src={img.image_url} alt={img.alt_text || img.caption || ''} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="p-3">
              {img.caption && <p className="text-xs font-semibold text-green-800 truncate mb-2">{img.caption}</p>}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-green-400">#{img.sort_order}</span>
                <div className="flex gap-1.5">
                  <button onClick={() => setEditing(img)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-caramel-50 text-caramel-600 hover:bg-caramel-100">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(img)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-16">
          <Images className="h-12 w-12 text-green-300 mx-auto mb-3" />
          <p className="text-green-600 font-semibold">{t('No gallery images yet', 'لا توجد صور')}</p>
        </div>
      )}

      {editing && (
        <GalleryEditForm image={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); fetchData(); }} />
      )}
    </div>
  );
}

function GalleryEditForm({ image, onClose, onSaved }: { image: GalleryImage; onClose: () => void; onSaved: () => void }) {
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const [caption, setCaption] = useState(image.caption ?? '');
  const [altText, setAltText] = useState(image.alt_text ?? '');
  const [sortOrder, setSortOrder] = useState(image.sort_order);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('gallery_images').update({
      caption: caption.trim() || null,
      alt_text: altText.trim() || null,
      sort_order: sortOrder,
    }).eq('id', image.id);
    setSaving(false);
    if (error) { showToast(t('Failed to save', 'فشل الحفظ'), 'error'); return; }
    showToast(t('Updated', 'تم التحديث'));
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl shadow-premium w-full max-w-md">
        <div className="border-b border-green-50 px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-green-800">{t('Edit Image', 'تعديل الصورة')}</h2>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-cream-100"><X className="h-5 w-5 text-green-600" /></button>
        </div>
        <div className="p-6 space-y-4">
          <img src={image.image_url} alt={altText} className="w-full h-40 object-cover rounded-xl" />
          <div>
            <label className="label">{t('Caption', 'تعليق')}</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">{t('Alt Text (SEO)', 'نص بديل (SEO)')}</label>
            <input value={altText} onChange={(e) => setAltText(e.target.value)} className="input" />
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
