import { ArrowRight, Coffee, Sparkles, Citrus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { SiteSettings } from '@/types';

interface HeroProps {
  settings: SiteSettings | null;
}

export default function Hero({ settings }: HeroProps) {
  const { t, dir } = useLanguage();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const title = settings ? (dir === 'rtl' ? settings.hero_title_ar : settings.hero_title_en) : 'VERO VITA';
  const tagline = settings ? (dir === 'rtl' ? settings.hero_tagline_ar : settings.hero_tagline_en) : '';

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-green-950/40 via-transparent to-green-950/60" />

      {/* Floating decorative shapes */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-caramel-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

      {/* Content */}
      <div className="container-x relative z-10 pt-24 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-2 mb-6 animate-fade-in-down">
            <Sparkles className="h-4 w-4 text-caramel-400" />
            <span className="text-sm font-semibold text-cream-100">
              {t('Drinks, Dessert and More', 'مشروبات وحلويات والمزيد')}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-cream-50 mb-4 animate-fade-in-up tracking-tight">
            {title}
          </h1>

          {/* Underline accent */}
          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in-up animate-delay-200">
            <div className="h-px w-12 bg-caramel-400/60" />
            <Citrus className="h-5 w-5 text-caramel-400" />
            <div className="h-px w-12 bg-caramel-400/60" />
          </div>

          {/* Tagline */}
          <p className="text-lg sm:text-xl text-cream-200/90 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up animate-delay-300 text-balance">
            {tagline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-500">
            <button
              onClick={() => scrollToSection('menu')}
              className="btn-primary group text-base px-8 py-4"
            >
              <Coffee className="h-5 w-5" />
              {t('View Menu', 'تصفح القائمة')}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </button>
            <button
              onClick={() => scrollToSection('order')}
              className="btn-secondary text-base px-8 py-4"
            >
              {t('Order Now', 'اطلب الآن')}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in animate-delay-700">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-cream-300/70 font-medium">
            {t('Scroll to explore', 'مرر للأسفل')}
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-cream-300/40 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-caramel-400 animate-float" />
          </div>
        </div>
      </div>
    </section>
  );
}
