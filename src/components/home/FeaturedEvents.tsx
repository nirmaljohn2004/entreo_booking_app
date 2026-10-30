import React from 'react';
import { useStore } from '../../store/useStore';
import { translations } from '../../i18n/translations';
import { SectionHeader } from '../ui/SectionHeader';
import { EventCard } from '../events/EventCard';

export const FeaturedEvents: React.FC = () => {
  const { events, lang } = useStore();
  const t = translations[lang];

  // Pick top featured events (6 events for a clean 2x3 desktop grid)
  const featured = events.filter((e) => e.status === 'published').slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      <SectionHeader
        eyebrow={t.featured.eyebrow}
        title={`${t.featured.title} ${t.featured.highlight}`}
        actionText={t.featured.seeAll}
        actionHref="/events"
      />

      {/* Mobile Horizontal Snap Scroll / Desktop Grid */}
      <div className="flex overflow-x-auto pb-4 gap-3.5 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-none">
        {featured.map((event) => (
          <div
            key={event.id}
            className="w-[240px] sm:w-auto shrink-0 snap-start flex flex-col"
          >
            <EventCard event={event} className="h-full" />
          </div>
        ))}
      </div>
    </section>
  );
};

