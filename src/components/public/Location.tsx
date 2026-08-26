import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { SiteSettings } from '@/types';

interface LocationProps {
  settings: SiteSettings | null;
}

export default function Location({ settings }: LocationProps) {
  const { t } = useLanguage();
  const mapsUrl = settings?.google_maps_url ?? 'https://maps.app.goo.gl/pHWnSWaEMwkpdCZn9';

  return (
    <section id="location" className="py-20 sm:py-28 bg-cream-100 relative overflow-hidden">
      <div className="container-x">
        <div className="text-center mb-12">
          <div className="badge-caramel mb-4 mx-auto">
            <MapPin className="h-3.5 w-3.5" />
            {t('Location', 'الموقع')}
          </div>
          <h2 className="section-title mb-3">{t('Find Us', 'تجدنا هنا')}</h2>
          <p className="section-subtitle">
            {t(
              'Visit us in Tabarbour, Amman. Click below for directions.',
              'زرنا في طبربور، عمان. انقر أدناه للوصول إلى الموقع.'
            )}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Map embed */}
          <div className="relative rounded-2xl overflow-hidden shadow-card border-4 border-white mb-6">
            <iframe
              src="https://www.google.com/maps?q=Tabarbour+Amman+Jordan&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="VERO VITA Location"
              className="w-full"
            />
          </div>

          {/* CTA button */}
          <div className="text-center">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary group text-base px-8 py-4 inline-flex"
            >
              <Navigation className="h-5 w-5" />
              {t('Click for Directions', 'انقر للوصول إلى الموقع')}
              <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
