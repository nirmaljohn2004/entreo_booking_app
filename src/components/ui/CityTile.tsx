import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CityInfo } from '../../types';

interface CityTileProps {
  city: CityInfo;
  className?: string;
  showCount?: boolean;
}

export const CityTile: React.FC<CityTileProps> = ({
  city,
  className = '',
}) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/events?city=${encodeURIComponent(city.name)}`)}
      className={`group relative overflow-hidden rounded-xl aspect-[1.52/1] w-full text-left bg-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-entreo-red focus-visible:ring-offset-2 transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98] shadow-sm ${className}`}
      aria-label={`Events in ${city.name}`}
    >
      {/* City image */}
      <img
        src={city.image}
        alt={city.name}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Subtle vignette/gradient overlay so serif text is always crisp and legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 via-45% to-transparent pointer-events-none" />

      {/* City name label matching reference typography */}
      <span className="absolute bottom-0 left-0 right-0 px-2 sm:px-3 pb-1.5 sm:pb-2.5 pt-5 font-serif text-white text-xs sm:text-sm md:text-base font-bold tracking-tight leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] truncate">
        {city.name}
      </span>
    </button>
  );
};
