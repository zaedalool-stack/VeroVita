import { Coffee, Phone, MessageCircle, MapPin, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { SiteSettings } from '@/types';

interface FooterProps {
  settings: SiteSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const { t, lang, toggleLang } = useLanguage();

  const phone = settings?.phone ?? '+962793434777';
  const whatsapp = settings?.whatsapp ?? '962793434777';
  const mapsUrl = settings?.google_maps_url ?? 'https://maps.app.goo.gl/pHWnSWaEMwkpdCZn9';
  const businessName = settings?.business_name ?? 'VERO VITA';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const quickLinks = [
    { id: 'about', label: t('About', 'من نحن') },
    { id: 'menu', label: t('Menu', 'القائمة') },
    { id: 'order', label: t('Order Now', 'اطلب الآن') },
    { id: 'contact', label: t('Contact', 'تواصل') },
    { id: 'location', label: t('Location', 'الموقع') },
  ];

  return (
    <footer className="bg-green-950 text-cream-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern opacity-10" />

      <div className="container-x relative pt-16 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-green">
                <Coffee className="h-5 w-5 text-caramel-400" />
              </div>
              <div>
                <div className="font-display text-lg font-bold text-cream-50">{businessName}</div>
                <div className="text-xs text-caramel-300">{t('Drinks, Dessert & More', 'مشروبات وحلويات والمزيد')}</div>
              </div>
            </div>
            <p className="text-sm text-cream-200/60 leading-relaxed">
              {t(
                'A modern café experience in Tabarbour, Amman. Fresh ingredients, premium taste, warm atmosphere.',
                'تجربة كافيه عصرية في طبربور، عمان. مكونات طازجة، طعم فاخر، أجواء دافئة.'
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-bold text-caramel-400 uppercase tracking-wider mb-4">
              {t('Quick Links', 'روابط سريعة')}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-sm text-cream-200/70 hover:text-cream-50 hover:translate-x-1 rtl:hover:-translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-bold text-caramel-400 uppercase tracking-wider mb-4">
              {t('Contact', 'تواصل')}
            </h4>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${phone}`} className="flex items-center gap-2.5 text-sm text-cream-200/70 hover:text-cream-50 transition-colors">
                  <Phone className="h-4 w-4 text-caramel-400 flex-shrink-0" />
                  {phone}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-cream-200/70 hover:text-cream-50 transition-colors">
                  <MessageCircle className="h-4 w-4 text-[#25D366] flex-shrink-0" />
                  {t('WhatsApp', 'واتساب')}
                </a>
              </li>
              <li>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-cream-200/70 hover:text-cream-50 transition-colors">
                  <MapPin className="h-4 w-4 text-caramel-400 flex-shrink-0" />
                  {t('Tabarbour, Amman', 'طبربور، عمان')}
                </a>
              </li>
            </ul>
          </div>

          {/* Language */}
          <div>
            <h4 className="font-display text-sm font-bold text-caramel-400 uppercase tracking-wider mb-4">
              {t('Language', 'اللغة')}
            </h4>
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 rounded-xl bg-green-800/50 hover:bg-green-800 px-4 py-2.5 text-sm font-semibold text-cream-100 transition-all"
            >
              <Globe className="h-4 w-4 text-caramel-400" />
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-green-800/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream-300/50 text-center sm:text-start">
            © {new Date().getFullYear()} {businessName}. {t('All rights reserved.', 'جميع الحقوق محفوظة.')}
          </p>
          <button
            onClick={() => scrollToSection('home')}
            className="text-xs text-cream-300/50 hover:text-caramel-400 transition-colors"
          >
            {t('Back to top', 'العودة للأعلى')}
          </button>
        </div>
      </div>
    </footer>
  );
}
