import { Leaf, Heart, Award, Coffee } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { SiteSettings } from '@/types';

interface AboutProps {
  settings: SiteSettings | null;
}

export default function About({ settings }: AboutProps) {
  const { t, dir } = useLanguage();

  const aboutText = settings ? (dir === 'rtl' ? settings.about_ar : settings.about_en) : '';

  const features = [
    { icon: Leaf, title_en: 'Fresh Ingredients', title_ar: 'مكونات طازجة', desc_en: 'Carefully selected daily', desc_ar: 'تُختار بعناية يومياً' },
    { icon: Award, title_en: 'Premium Quality', title_ar: 'جودة فاخرة', desc_en: 'High-quality ingredients', desc_ar: 'مكونات عالية الجودة' },
    { icon: Heart, title_en: 'Crafted with Care', title_ar: 'صناعة متقنة', desc_en: 'Every drink made with love', desc_ar: 'كل مشروب يُصنع بحب' },
    { icon: Coffee, title_en: 'Modern Café', title_ar: 'كافيه عصري', desc_en: 'A warm, welcoming atmosphere', desc_ar: 'أجواء دافئة ومرحبة' },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 bg-cream-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-caramel-100/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

      <div className="container-x relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div>
            <div className="badge-green mb-4">
              <Leaf className="h-3.5 w-3.5" />
              {t('About Us', 'من نحن')}
            </div>
            <h2 className="section-title mb-6 text-start">
              {t('The VERO VITA Story', 'قصة فيرو فيتا')}
            </h2>
            <div className="text-green-700/80 leading-loose text-base sm:text-lg whitespace-pre-line">
              {aboutText || (dir === 'rtl'
                ? 'كافيه في عمان يقدم مشروبات وحلويات بمكونات عالية الجودة.'
                : 'A café in Amman serving drinks and desserts with high-quality ingredients.')}
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-4 mt-10">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="card-hover p-5 animate-fade-in-up"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 mb-3">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-green-800 text-sm mb-1">
                      {t(f.title_en, f.title_ar)}
                    </h3>
                    <p className="text-xs text-green-600/70">
                      {t(f.desc_en, f.desc_ar)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual side */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Decorative cards instead of photos (photos added via admin gallery) */}
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-2xl gradient-green p-6 flex flex-col justify-between shadow-card animate-fade-in-up">
                  <Coffee className="h-8 w-8 text-caramel-300" />
                  <div>
                    <div className="text-3xl font-display font-bold text-cream-50">90+</div>
                    <div className="text-sm text-cream-200/80">{t('Menu Items', 'أصناف القائمة')}</div>
                  </div>
                </div>
                <div className="aspect-square rounded-2xl gradient-caramel p-6 flex flex-col justify-between shadow-caramel animate-fade-in-up animate-delay-200">
                  <Leaf className="h-8 w-8 text-cream-50" />
                  <div>
                    <div className="text-3xl font-display font-bold text-cream-50">100%</div>
                    <div className="text-sm text-cream-100/80">{t('Fresh Daily', 'طازج يومياً')}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-2xl bg-green-800 p-6 flex flex-col justify-between shadow-card animate-fade-in-up animate-delay-300">
                  <Award className="h-8 w-8 text-caramel-400" />
                  <div>
                    <div className="text-3xl font-display font-bold text-cream-50">9</div>
                    <div className="text-sm text-cream-200/80">{t('Categories', 'فئات')}</div>
                  </div>
                </div>
                <div className="aspect-[3/4] rounded-2xl bg-caramel-700 p-6 flex flex-col justify-between shadow-caramel animate-fade-in-up animate-delay-500">
                  <Heart className="h-8 w-8 text-cream-100" />
                  <div>
                    <div className="text-3xl font-display font-bold text-cream-50">{t('Amman', 'عمان')}</div>
                    <div className="text-sm text-cream-200/80">{t('Tabarbour', 'طبربور')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
