import { Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { SiteSettings } from '@/types';

interface FloatingActionsProps {
  settings: SiteSettings | null;
}

export default function FloatingActions({ settings }: FloatingActionsProps) {
  const { t } = useLanguage();
  const phone = settings?.phone ?? '+962793434777';
  const whatsapp = settings?.whatsapp ?? '962793434777';
  const whatsappMsg = encodeURIComponent('مرحباً، أود الاستفسار عن VERO VITA.');

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3" dir="ltr">
      <a
        href={`https://wa.me/${whatsapp}?text=${whatsappMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('WhatsApp', 'واتساب')}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-premium transition-all hover:scale-110 hover:shadow-lg"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute right-16 bg-green-950 text-cream-50 text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {t('WhatsApp', 'واتساب')}
        </span>
      </a>
      <a
        href={`tel:${phone}`}
        aria-label={t('Call', 'اتصل')}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-cream-50 shadow-premium transition-all hover:scale-110 hover:shadow-lg"
      >
        <Phone className="h-6 w-6" />
        <span className="absolute right-16 bg-green-950 text-cream-50 text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {t('Call Now', 'اتصل الآن')}
        </span>
      </a>
    </div>
  );
}
