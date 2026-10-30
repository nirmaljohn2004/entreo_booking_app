import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';
import { CityName } from '../../types';

interface VenueMapMockProps {
  venueName: string;
  address: string;
  postalCode: string;
  city: CityName;
}

export const VenueMapMock: React.FC<VenueMapMockProps> = ({
  venueName,
  address,
  postalCode,
  city,
}) => {
  return (
    <div className="rounded-2xl overflow-hidden border border-entreo-border bg-white shadow-soft-card">
      {/* Map visual graphic simulation */}
      <div className="relative h-44 w-full bg-[#E8ECEF] overflow-hidden flex items-center justify-center select-none">
        {/* Stylized SVG Map Grid & River */}
        <svg
          className="absolute inset-0 w-full h-full opacity-60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#D1D9E0" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* River curve */}
          <path
            d="M -20 80 Q 150 40 280 120 T 600 90"
            fill="none"
            stroke="#BDD3E6"
            strokeWidth="24"
            strokeLinecap="round"
          />
          {/* Main roads */}
          <path d="M 0 110 L 600 110" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M 200 0 L 200 300" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M 360 0 L 360 300" stroke="#FDE293" strokeWidth="5" />
        </svg>

        {/* Central Map Marker */}
        <div className="relative z-10 flex flex-col items-center animate-bounce duration-1000">
          <div className="w-10 h-10 rounded-full bg-entreo-red text-white flex items-center justify-center shadow-lg ring-4 ring-white">
            <MapPin className="w-5 h-5 fill-white" />
          </div>
          <div className="mt-1 bg-entreo-ink text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
            {venueName}
          </div>
        </div>

        {/* Compass stamp */}
        <div className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-lg border border-black/5 text-entreo-muted">
          <Compass className="w-4 h-4" />
        </div>
      </div>

      {/* Address & Navigation Details */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold text-sm text-entreo-ink">{venueName}</h4>
          <p className="text-xs text-entreo-muted mt-0.5">
            {address}, {postalCode} {city}
          </p>
        </div>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(`${venueName}, ${address}, ${city}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-pill bg-entreo-chip hover:bg-entreo-chip-hover text-entreo-ink transition-colors shrink-0"
        >
          <Navigation className="w-3.5 h-3.5 text-entreo-red" />
          <span>Route</span>
        </a>
      </div>
    </div>
  );
};

