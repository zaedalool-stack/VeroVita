import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ChevronDown, X, Utensils } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { Category, MenuItem } from '@/types';

interface MenuSectionProps {
  categories: Category[];
  menuItems: MenuItem[];
}

export default function MenuSection({ categories, menuItems }: MenuSectionProps) {
  const { t, lang, dir } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  const enabledCategories = useMemo(
    () => categories.filter((c) => c.is_enabled).sort((a, b) => a.sort_order - b.sort_order),
    [categories]
  );

  const enabledItems = useMemo(
    () => menuItems.filter((i) => i.is_enabled),
    [menuItems]
  );

  const filteredItems = useMemo(() => {
    let items = enabledItems;
    if (activeCategory !== 'all') {
      items = items.filter((i) => i.category_id === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter((i) =>
        i.name_en.toLowerCase().includes(q) ||
        i.name_ar.includes(q) ||
        (i.description_en?.toLowerCase().includes(q) ?? false) ||
        (i.description_ar?.includes(q) ?? false)
      );
    }
    return items;
  }, [enabledItems, activeCategory, search]);

  const itemsByCategory = useMemo(() => {
    const map: Record<string, MenuItem[]> = {};
    for (const cat of enabledCategories) {
      map[cat.id] = filteredItems
        .filter((i) => i.category_id === cat.id)
        .sort((a, b) => a.sort_order - b.sort_order);
    }
    return map;
  }, [enabledCategories, filteredItems]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Wait for filter to apply, then scroll
      setTimeout(() => {
        categoryRefs.current[catId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  // When filtering by "all", show all categories with items
  const visibleCategories = activeCategory === 'all'
    ? enabledCategories.filter((c) => (itemsByCategory[c.id]?.length ?? 0) > 0)
    : enabledCategories.filter((c) => c.id === activeCategory && (itemsByCategory[c.id]?.length ?? 0) > 0);

  return (
    <section id="menu" ref={sectionRef} className="py-20 sm:py-28 bg-gradient-to-b from-cream-50 to-cream-100 relative">
      <div className="container-x">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="badge-caramel mb-4 mx-auto">
            <Utensils className="h-3.5 w-3.5" />
            {t('Our Menu', 'قائمتنا')}
          </div>
          <h2 className="section-title mb-3">{t('Explore Our Offerings', 'اكتشف أصنافنا')}</h2>
          <p className="section-subtitle">
            {t(
              'From fresh juices to premium coffee and decadent desserts — discover everything we craft for you.',
              'من العصائر الطازجة إلى القهوة الفاخرة والحلويات الشهية — اكتشف كل ما نصنعه لك.'
            )}
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-green-400 ${dir === 'rtl' ? 'right-4' : 'left-4'}`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('Search menu items...', 'ابحث في القائمة...')}
              className={`input text-base ${dir === 'rtl' ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-3.5`}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'left-4' : 'right-4'} text-green-400 hover:text-green-600`}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => scrollToCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeCategory === 'all'
                ? 'bg-green-600 text-cream-50 shadow-soft'
                : 'bg-white text-green-700 hover:bg-green-50 border border-green-100'
            }`}
          >
            {t('All', 'الكل')}
          </button>
          {enabledCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-green-600 text-cream-50 shadow-soft'
                  : 'bg-white text-green-700 hover:bg-green-50 border border-green-100'
              }`}
            >
              {lang === 'ar' ? cat.name_ar : cat.name_en}
            </button>
          ))}
        </div>

        {/* Menu items by category */}
        {visibleCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-300 mb-4">
              <Search className="h-8 w-8" />
            </div>
            <p className="text-green-600 font-semibold text-lg">
              {t('No items found', 'لا توجد أصناف')}
            </p>
            <p className="text-green-400 text-sm mt-1">
              {t('Try a different search or category', 'جرّب بحثاً أو فئة مختلفة')}
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {visibleCategories.map((cat) => (
              <div
                key={cat.id}
                ref={(el) => { categoryRefs.current[cat.id] = el; }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-200 to-transparent" />
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-green-800 whitespace-nowrap">
                    {lang === 'ar' ? cat.name_ar : cat.name_en}
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-200 to-transparent" />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {itemsByCategory[cat.id]?.map((item, i) => {
                    const name = lang === 'ar' ? item.name_ar : item.name_en;
                    const desc = lang === 'ar' ? item.description_ar : item.description_en;
                    const isExpanded = expandedItems.has(item.id);
                    const hasLongDesc = desc && desc.length > 120;

                    return (
                      <article
                        key={item.id}
                        className="card-hover overflow-hidden animate-fade-in-up"
                        style={{ animationDelay: `${Math.min(i * 50, 300)}ms` }}
                      >
                        {item.image_url && (
                          <div className="aspect-[4/3] overflow-hidden bg-cream-100">
                            <img
                              src={item.image_url}
                              alt={item.image_alt || name}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h4 className="font-bold text-green-800 text-base leading-snug flex-1">
                              {name}
                            </h4>
                            {item.price != null && (
                              <span className="badge-caramel flex-shrink-0">
                                {item.price} {t('JOD', 'د.أ')}
                              </span>
                            )}
                          </div>
                          {desc && (
                            <p className={`text-sm text-green-600/70 leading-relaxed ${
                              !isExpanded && hasLongDesc ? 'line-clamp-2' : ''
                            }`}>
                              {desc}
                            </p>
                          )}
                          {hasLongDesc && (
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="flex items-center gap-1 text-xs font-semibold text-caramel-600 hover:text-caramel-700 mt-2"
                            >
                              {isExpanded ? t('Show less', 'عرض أقل') : t('Show more', 'عرض المزيد')}
                              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
