import { useEffect } from 'react';
import { Images, ImageOff } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { GalleryImage } from '@/types';

interface GalleryProps {
  images: GalleryImage[];
}

export default function Gallery({ images }: GalleryProps) {
  const { t, lang } = useLanguage();

  if (images.length === 0) return null;

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-cream-50">
      <div className="container-x">
        <div className="text-center mb-12">
          <div className="badge-green mb-4 mx-auto">
            <Images className="h-3.5 w-3.5" />
            {t('Gallery', 'المعرض')}
          </div>
          <h2 className="section-title mb-3">{t('Café Gallery', 'معرض الكافيه')}</h2>
          <p className="section-subtitle">
            {t('A glimpse into the VERO VITA experience', 'لمحة عن تجربة فيرو فيتا')}
          </p>
        </div>

        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
          {images
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((img, i) => (
              <div
                key={img.id}
                className="break-inside-avoid relative overflow-hidden rounded-2xl group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
              >
                <img
                  src={img.image_url}
                  alt={lang === 'ar' ? img.alt_text || img.caption || '' : img.alt_text || img.caption || ''}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {img.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-green-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-cream-50 text-sm font-semibold">{img.caption}</p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
