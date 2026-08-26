import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { SiteSettings } from '@/types';

interface ContactProps {
  settings: SiteSettings | null;
}

export default function Contact({ settings }: ContactProps) {
  const { t } = useLanguage();

  const phone = settings?.phone ?? '+962793434777';
  const whatsapp = settings?.whatsapp ?? '962793434777';
  const whatsappMsg = encodeURIComponent('مرحباً، أود الاستفسار عن VERO VITA.');

  return (
    <section id="contact" className="py-20 sm:py-28 bg-cream-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-green-100/30 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container-x relative">
        <div className="text-center mb-12">
          <div className="badge-green mb-4 mx-auto">
            <Phone className="h-3.5 w-3.5" />
            {t('Contact Us', 'تواصل معنا')}
          </div>
          <h2 className="section-title mb-3">{t('Get in Touch', 'تواصل معنا')}</h2>
          <p className="section-subtitle">
            {t(
              'Have a question or want to place an order? We\'re here for you.',
              'لديك سؤال أو تريد تقديم طلب؟ نحن هنا من أجلك.'
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Call */}
          <a
            href={`tel:${phone}`}
            className="group relative overflow-hidden rounded-2xl gradient-green p-8 text-center text-cream-50 shadow-card transition-all duration-300 hover:shadow-premium hover:-translate-y-1 animate-fade-in-up"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 mb-5 transition-transform group-hover:scale-110">
              <Phone className="h-8 w-8 text-caramel-300" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              {t('Call', 'اتصل')}
            </h3>
            <p className="text-cream-200/80 text-sm mb-3">
              {t('Click to call', 'انقر للاتصال')}
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
              {phone}
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${whatsapp}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl bg-[#25D366] p-8 text-center text-white shadow-soft transition-all duration-300 hover:shadow-premium hover:-translate-y-1 animate-fade-in-up animate-delay-200"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 mb-5 transition-transform group-hover:scale-110">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              {t('WhatsApp', 'واتساب')}
            </h3>
            <p className="text-white/80 text-sm mb-3">
              {t('Chat on WhatsApp', 'تواصل عبر الواتساب')}
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
              <MessageCircle className="h-4 w-4" />
              {t('Open WhatsApp', 'افتح واتساب')}
            </div>
          </a>
        </div>

        {/* Quick info */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <a href={`tel:${phone}`} className="flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold">
            <Phone className="h-4 w-4 text-caramel-500" />
            {phone}
          </a>
          <span className="text-green-300">•</span>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold">
            <MessageCircle className="h-4 w-4 text-[#25D366]" />
            {t('WhatsApp', 'واتساب')}
          </a>
        </div>
      </div>
    </section>
  );
}
