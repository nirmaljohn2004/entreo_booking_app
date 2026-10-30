import React from 'react';
import { CITIES } from '../../data/cities';
import { CityTile } from '../ui/CityTile';
import { useStore } from '../../store/useStore';
import { translations } from '../../i18n/translations';

export const PopularCities: React.FC = () => {
  const { lang } = useStore();
  const t = translations[lang];

  // Top 4 cities as displayed in mobile reference
  const popular = CITIES.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      {/* Clean Eyebrow Label */}
      <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-2.5">
        {t.popularCities.eyebrow}
      </p>

      {/* Grid of 4 cities */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {popular.map((city) => (
          <CityTile key={city.name} city={city} />
        ))}
      </div>
    </section>
  );
};

