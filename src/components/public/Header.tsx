import { useState, useEffect } from 'react';
import { Menu, X, Phone, Coffee } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { SiteSettings } from '@/types';

interface HeaderProps {
  settings: SiteSettings | null;
}

export default function Header({ settings }: HeaderProps) {
  const { lang, toggleLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: t('Home', 'الرئيسية') },
    { id: 'menu', label: t('Menu', 'القائمة') },
    { id: 'order', label: t('Order Now', 'اطلب الآن') },
    { id: 'about', label: t('About Us', 'من نحن') },
    { id: 'contact', label: t('Contact', 'تواصل') },
    { id: 'location', label: t('Location', 'الموقع') },
  ];

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-soft' : 'bg-transparent'
        }`}
      >
        <div className="container-x">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-2.5 group"
            >
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="VERO VITA" className="h-10 sm:h-12 w-auto" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl gradient-green shadow-soft">
                    <Coffee className="h-5 w-5 sm:h-6 sm:w-6 text-caramel-400" />
                  </div>
                  <div className="text-left">
                    <div className={`font-display text-lg sm:text-xl font-bold leading-none ${scrolled ? 'text-green-800' : 'text-cream-50'}`}>
                      VERO VITA
                    </div>
                    <div className={`text-[10px] sm:text-xs font-medium ${scrolled ? 'text-caramel-600' : 'text-caramel-300'}`}>
                      {t('Drinks, Dessert & More', 'مشروبات وحلويات والمزيد')}
                    </div>
                  </div>
                </div>
              )}
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    scrolled
                      ? 'text-green-800 hover:bg-green-50'
                      : 'text-cream-50 hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right: Language + Mobile toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLang}
                className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold transition-all ${
                  scrolled
                    ? 'bg-caramel-100 text-caramel-700 hover:bg-caramel-200'
                    : 'bg-white/15 text-cream-50 hover:bg-white/25'
                }`}
              >
                <span className="text-base">{lang === 'ar' ? '🇬🇧' : '🇯🇴'}</span>
                <span>{lang === 'ar' ? 'EN' : 'ع'}</span>
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                  scrolled ? 'bg-green-50 text-green-700' : 'bg-white/15 text-cream-50'
                }`}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden glass border-t border-white/20 animate-fade-in-down">
            <nav className="container-x py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-green-800 font-semibold hover:bg-green-50 transition-all"
                >
                  {link.label}
                </button>
              ))}
              <a
                href={`tel:${settings?.phone ?? '+962793434777'}`}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-cream-50 font-semibold mt-2"
              >
                <Phone className="h-4 w-4" />
                {t('Call Now', 'اتصل الآن')}
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
