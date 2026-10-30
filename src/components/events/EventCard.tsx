import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, ArrowRight } from 'lucide-react';
import { EventItem } from '../../types';
import { DateBadge } from '../ui/DateBadge';
import { GenreChip } from '../ui/GenreChip';
import { useStore } from '../../store/useStore';

interface EventCardProps {
  event: EventItem;
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({ event, className = '' }) => {
  const navigate = useNavigate();
  const { savedEventIds, toggleSavedEvent, lang } = useStore();
  const isSaved = savedEventIds.includes(event.id);

  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSavedEvent(event.id);
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/events/${event.id}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className={`group bg-white rounded-2xl overflow-hidden shadow-soft-card border border-entreo-border/60 hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer select-none ${className}`}
      aria-label={`${event.title} in ${event.city}`}
    >
      {/* Artwork with Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-entreo-chip">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Floating Date Badge at bottom-left matching design benchmark */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <DateBadge dateString={event.startDate} />
        </div>

        {/* Floating Heart / Save Icon */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label={isSaved ? 'Von Merkliste entfernen' : 'Auf Merkliste speichern'}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-transform active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isSaved ? 'fill-entreo-red text-entreo-red' : 'text-white'
            }`}
          />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Title */}
          <h3 className="font-bold text-lg text-entreo-ink leading-snug group-hover:text-entreo-red transition-colors line-clamp-1">
            {event.title}
          </h3>

          {/* Venue */}
          <p className="text-xs text-entreo-muted mt-0.5 line-clamp-1">
            {event.venue.name}
          </p>

          {/* City */}
          <div className="flex items-center gap-1 text-xs text-entreo-muted mt-1">
            <MapPin className="w-3 h-3 text-entreo-red shrink-0" />
            <span>{event.city}</span>
          </div>

          {/* Genre Chips */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {event.genreTags.slice(0, 3).map((tag) => (
              <GenreChip key={tag} label={tag} />
            ))}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-end justify-between mt-3.5 pt-2.5 border-t border-entreo-border/40">
          <div>
            <span className="block text-[11px] text-entreo-muted leading-none">
              {lang === 'DE' ? 'Ab' : 'From'}
            </span>
            <span className="font-extrabold text-base md:text-lg text-entreo-ink leading-tight">
              € {event.minPrice}
            </span>
          </div>

          <button
            type="button"
            onClick={handleArrowClick}
            aria-label={`${event.title} Tickets auswählen`}
            className="w-8 h-8 rounded-full bg-entreo-red text-white flex items-center justify-center shadow-sm hover:bg-entreo-red-hover transition-transform group-hover:scale-105 active:scale-95"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
