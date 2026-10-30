import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface ExperienceCategory {
  id: string;
  titleDE: string;
  titleEN: string;
  subtitleDE: string;
  subtitleEN: string;
  image: string;
  eventCount: number;
  path: string;
}

const CATEGORIES: ExperienceCategory[] = [
  {
    id: 'concerts',
    titleDE: 'Konzerte & Live-Musik',
    titleEN: 'Concerts & Live Music',
    subtitleDE: '34 Events bundesweit',
    subtitleEN: '34 events nationwide',
    image: '/images/categories/concerts.jpg',
    eventCount: 34,
    path: '/events?category=concert',
  },
  {
    id: 'electronic',
    titleDE: 'Clubkultur & Beats',
    titleEN: 'Electronic & Nightlife',
    subtitleDE: '28 Events bundesweit',
    subtitleEN: '28 events nationwide',
    image: '/images/categories/electronic.jpg',
    eventCount: 28,
    path: '/events?category=clubbing',
  },
  {
    id: 'comedy',
    titleDE: 'Stand-up & Comedy',
    titleEN: 'Stand-up & Comedy',
    subtitleDE: '19 Events bundesweit',
    subtitleEN: '19 events nationwide',
    image: '/images/categories/comedy.jpg',
    eventCount: 19,
    path: '/events?category=comedy',
  },
  {
    id: 'cultural-stages',
    titleDE: 'Bühnenkunst & Tanz',
    titleEN: 'Theatre & Performing Arts',
    subtitleDE: '16 Events bundesweit',
    subtitleEN: '16 events nationwide',
    image: '/images/categories/theatre.jpg',
    eventCount: 16,
    path: '/events?q=Dance',
  },
];

export const CityScenes: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useStore();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      {/* Clean & Minimal Section Header — No loud red text, pure typographic elegance */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-1">
            {lang === 'DE' ? 'KATEGORIEN' : 'EXPERIENCES'}
          </p>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-entreo-ink font-bold tracking-tight">
            {lang === 'DE' ? "Deutschlands Bühnenszenen" : "Germany's Event Scenes"}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
            {lang === 'DE'
              ? 'Ausgewählte Live-Erlebnisse von intimen Konzerten bis zu legendären Clubnächten.'
              : 'Curated live experiences from intimate stages to legendary night-long sets.'}
          </p>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-600 hover:text-entreo-ink transition-colors shrink-0 self-start sm:self-end pb-1 group"
        >
          <span>{lang === 'DE' ? 'Alle Erlebnisse ansehen' : 'View all experiences'}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Clean, Minimal, Uncluttered Image Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {CATEGORIES.map((cat) => {
          const title = lang === 'DE' ? cat.titleDE : cat.titleEN;
          const subtitle = lang === 'DE' ? cat.subtitleDE : cat.subtitleEN;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate(cat.path)}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] sm:aspect-[4/5] w-full text-left bg-neutral-900 shadow-soft-card border border-neutral-200/70 hover:border-neutral-400/80 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-entreo-ink"
            >
              {/* Vibrant, clean photograph — no dark tinting covering the image */}
              <img
                src={cat.image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Gentle bottom-only gradient for flawless text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 via-45% to-transparent pointer-events-none" />

              {/* Clean, calm typography at the bottom */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex items-end justify-between gap-2 z-10">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight leading-snug drop-shadow-sm">
                    {title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-white/75 mt-0.5 font-normal tracking-normal">
                    {subtitle}
                  </p>
                </div>

                {/* Minimalist circular arrow trigger */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-white group-hover:text-black text-white flex items-center justify-center shrink-0 transition-all duration-300 shadow-xs">
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
