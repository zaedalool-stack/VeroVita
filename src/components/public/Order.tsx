import { Phone, ShoppingBag, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { SiteSettings } from '@/types';

interface OrderProps {
  settings: SiteSettings | null;
}

export default function Order({ settings }: OrderProps) {
  const { t } = useLanguage();

  const phone = settings?.phone ?? '+962793434777';
  const talabatUrl = settings?.talabat_url ?? 'https://www.talabat.com/jordan/vero';
  const ashiaiUrl = settings?.ashiai_url ?? 'https://mythings.app/share/Vendor/Jordan/Vero-Vita';

  const options = [
    {
      icon: Phone,
      title_en: 'Order Directly',
      title_ar: 'اطلب مباشرة من الفرع',
      desc_en: 'Call us and place your order directly',
      desc_ar: 'اتصل بنا واطلب مباشرة من الفرع',
      href: `tel:${phone}`,
      accent: 'gradient-green',
      text_accent: 'text-cream-50',
      external: false,
      badge: phone,
    },
    {
      icon: ShoppingBag,
      title_en: 'Order via Talabat',
      title_ar: 'اطلب عبر طلبات',
      desc_en: 'Order through Talabat delivery',
      desc_ar: 'اطلب عبر توصيل طلبات',
      href: talabatUrl,
      accent: 'bg-[#ff6110]',
      text_accent: 'text-white',
      external: true,
      badge: 'Talabat',
    },
    {
      icon: ShoppingBag,
      title_en: 'Order via Ashiai',
      title_ar: 'اطلب عبر أشيائي',
      desc_en: 'Order through Ashiai',
      desc_ar: 'اطلب عبر أشيائي',
      href: ashiaiUrl,
      accent: 'bg-[#e63946]',
      text_accent: 'text-white',
      external: true,
      badge: 'Ashiai',
    },
  ];

  return (
    <section id="order" className="py-20 sm:py-28 bg-green-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-caramel-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl" />

      <div className="container-x relative">
        <div className="text-center mb-12">
          <div className="badge-caramel mb-4 mx-auto">
            <ShoppingBag className="h-3.5 w-3.5" />
            {t('Order Now', 'اطلب الآن')}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-50 mb-3">
            {t('Choose Your Way to Order', 'اختر طريقة طلبك')}
          </h2>
          <p className="text-cream-200/70 max-w-2xl mx-auto">
            {t(
              'Three convenient ways to get your favorite drinks and desserts delivered or ready for pickup.',
              'ثلاث طرق مريحة للحصول على مشروباتك وحلوياتك المفضلة توصيلاً أو جاهزة للاستلام.'
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {options.map((opt, i) => {
            const Icon = opt.icon;
            return (
              <a
                key={i}
                href={opt.href}
                target={opt.external ? '_blank' : undefined}
                rel={opt.external ? 'noopener noreferrer' : undefined}
                className="group relative overflow-hidden rounded-2xl bg-green-900/50 border border-green-800/50 p-8 text-center transition-all duration-300 hover:bg-green-800/50 hover:border-caramel-500/30 hover:shadow-premium hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${opt.accent} ${opt.text_accent} shadow-card mb-5 transition-transform group-hover:scale-110`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-bold text-cream-50 mb-2">
                  {t(opt.title_en, opt.title_ar)}
                </h3>
                <p className="text-sm text-cream-200/60 mb-4">
                  {t(opt.desc_en, opt.desc_ar)}
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-caramel-400">
                  <span>{opt.badge}</span>
                  {opt.external && <ExternalLink className="h-3.5 w-3.5" />}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
