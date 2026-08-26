import { useEffect, useState, useCallback } from 'react';
import { Save, Loader2, Upload, Trash2, Settings as SettingsIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/types';

export default function SettingsManager() {
  const { t, lang } = useLanguage();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
    setSettings(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const update = (field: keyof SiteSettings, value: string | null) => {
    setSettings((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const { id, updated_at, ...payload } = settings;
    const { error } = await supabase.from('site_settings').update(payload).eq('id', 1);
    setSaving(false);
    if (error) { showToast(t('Failed to save settings', 'فشل حفظ الإعدادات'), 'error'); return; }
    showToast(t('Settings saved successfully', 'تم حفظ الإعدادات بنجاح'));
  };

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `logo-${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('gallery-images').upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from('gallery-images').getPublicUrl(fileName);
      update('logo_url', urlData.publicUrl);
      showToast(t('Logo uploaded', 'تم رفع الشعار'));
    } catch {
      showToast(t('Upload failed', 'فشل الرفع'), 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (settings?.logo_url) {
      const path = settings.logo_url.split('/gallery-images/')[1];
      if (path) await supabase.storage.from('gallery-images').remove([path]);
    }
    update('logo_url', null);
  };

  if (loading || !settings) return <div className="skeleton h-96 rounded-2xl" />;

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div dir={dir}>
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-green-800">{t('Settings', 'الإعدادات')}</h1>
        <p className="text-sm text-green-600/70 mt-1">{t('Update your website content without editing code', 'حدّث محتوى موقعك دون تعديل الكود')}</p>
      </div>

      <div className="space-y-6">
        {/* Business Info */}
        <SettingsCard title={t('Business Information', 'معلومات النشاط')} icon={SettingsIcon}>
          <Field label={t('Business Name', 'اسم النشاط')} value={settings.business_name} onChange={(v) => update('business_name', v)} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t('Phone', 'الهاتف')} value={settings.phone} onChange={(v) => update('phone', v)} />
            <Field label={t('WhatsApp (digits only)', 'واتساب (أرقام فقط)')} value={settings.whatsapp} onChange={(v) => update('whatsapp', v)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t('Talabat URL', 'رابط طلبات')} value={settings.talabat_url} onChange={(v) => update('talabat_url', v)} />
            <Field label={t('Ashiai URL', 'رابط أشيائي')} value={settings.ashiai_url} onChange={(v) => update('ashiai_url', v)} />
          </div>
          <Field label={t('Google Maps URL', 'رابط خرائط جوجل')} value={settings.google_maps_url} onChange={(v) => update('google_maps_url', v)} />
        </SettingsCard>

        {/* Logo */}
        <SettingsCard title={t('Logo', 'الشعار')} icon={SettingsIcon}>
          {settings.logo_url ? (
            <div className="flex items-center gap-4">
              <img src={settings.logo_url} alt="Logo" className="h-16 w-auto rounded-xl bg-cream-50 p-2 border border-green-100" />
              <button onClick={handleRemoveLogo} className="btn-ghost text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
                {t('Remove', 'إزالة')}
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed border-green-200 bg-cream-50 cursor-pointer hover:border-caramel-400 transition-colors">
              {uploading ? <Loader2 className="h-6 w-6 text-green-400 animate-spin" /> : <Upload className="h-6 w-6 text-green-300" />}
              <span className="text-sm text-green-500">{uploading ? t('Uploading...', 'جار الرفع...') : t('Upload logo', 'ارفع الشعار')}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); }} />
            </label>
          )}
        </SettingsCard>

        {/* Hero */}
        <SettingsCard title={t('Hero Section', 'القسم الرئيسي')} icon={SettingsIcon}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t('Hero Title (EN)', 'العنوان الرئيسي (EN)')} value={settings.hero_title_en} onChange={(v) => update('hero_title_en', v)} />
            <Field label={t('Hero Title (AR)', 'العنوان الرئيسي (AR)')} value={settings.hero_title_ar} onChange={(v) => update('hero_title_ar', v)} dir="rtl" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t('Hero Tagline (EN)', 'الوصف (EN)')} value={settings.hero_tagline_en} onChange={(v) => update('hero_tagline_en', v)} textarea />
            <Field label={t('Hero Tagline (AR)', 'الوصف (AR)')} value={settings.hero_tagline_ar} onChange={(v) => update('hero_tagline_ar', v)} textarea dir="rtl" />
          </div>
        </SettingsCard>

        {/* About */}
        <SettingsCard title={t('About Us Content', 'محتوى من نحن')} icon={SettingsIcon}>
          <Field label={t('About (English)', 'من نحن (EN)')} value={settings.about_en} onChange={(v) => update('about_en', v)} textarea />
          <Field label={t('About (Arabic)', 'من نحن (AR)')} value={settings.about_ar} onChange={(v) => update('about_ar', v)} textarea dir="rtl" />
        </SettingsCard>

        {/* SEO */}
        <SettingsCard title={t('SEO Metadata', 'بيانات SEO')} icon={SettingsIcon}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t('SEO Title (EN)', 'عنوان SEO (EN)')} value={settings.seo_title_en} onChange={(v) => update('seo_title_en', v)} />
            <Field label={t('SEO Title (AR)', 'عنوان SEO (AR)')} value={settings.seo_title_ar} onChange={(v) => update('seo_title_ar', v)} dir="rtl" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={t('SEO Description (EN)', 'وصف SEO (EN)')} value={settings.seo_description_en} onChange={(v) => update('seo_description_en', v)} textarea />
            <Field label={t('SEO Description (AR)', 'وصف SEO (AR)')} value={settings.seo_description_ar} onChange={(v) => update('seo_description_ar', v)} textarea dir="rtl" />
          </div>
        </SettingsCard>

        {/* Save button */}
        <div className="sticky bottom-4 flex justify-end">
          <button onClick={handleSave} disabled={saving} className="btn-primary shadow-premium text-base px-8 py-4">
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {t('Save All Settings', 'حفظ جميع الإعدادات')}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsCard({ title, icon: Icon, children }: { title: string; icon: typeof SettingsIcon; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="font-display text-lg font-bold text-green-800">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, textarea, dir }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; dir?: string }) {
  return (
    <div>
      <label className="label">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className="input min-h-[80px]" dir={dir} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="input" dir={dir} />
      )}
    </div>
  );
}
