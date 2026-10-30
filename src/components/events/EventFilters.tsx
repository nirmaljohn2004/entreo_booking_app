import React from 'react';
import { Search, Filter, RotateCcw, ArrowUpDown } from 'lucide-react';
import { CITIES } from '../../data/cities';
import { CityName, EventCategory } from '../../types';
import { useStore } from '../../store/useStore';

export interface FilterState {
  keyword: string;
  city: string;
  category: string;
  date: string;
  maxPrice: number;
  sortBy: 'soonest' | 'price_asc' | 'price_desc' | 'relevance';
}

interface EventFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const { lang } = useStore();

  const categories: { id: EventCategory | 'all'; labelDE: string; labelEN: string }[] = [
    { id: 'all', labelDE: 'Alle Kategorien', labelEN: 'All Categories' },
    { id: 'concert', labelDE: 'Konzerte', labelEN: 'Concerts' },
    { id: 'clubbing', labelDE: 'Clubkultur & Beats', labelEN: 'Clubbing & Beats' },
    { id: 'comedy', labelDE: 'Comedy & Stand-up', labelEN: 'Comedy & Stand-up' },
    { id: 'theatre', labelDE: 'Theater & Performance', labelEN: 'Theatre & Performing Arts' },
    { id: 'festival', labelDE: 'Festivals', labelEN: 'Festivals' },
  ];

  const updateField = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const isFiltered =
    Boolean(filters.keyword) ||
    Boolean(filters.city) ||
    (filters.category !== 'all' && Boolean(filters.category)) ||
    Boolean(filters.date) ||
    filters.maxPrice < 150;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft-card border border-entreo-border space-y-4 mb-8">
      {/* Search Input Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-entreo-muted absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) => updateField('keyword', e.target.value)}
            placeholder={
              lang === 'DE'
                ? 'Events, Künstler, Genres durchsuchen...'
                : 'Search events, artists, genres...'
            }
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-entreo-border focus:outline-none focus:ring-1 focus:ring-entreo-red bg-entreo-cream/40"
          />
        </div>

        {/* City Dropdown */}
        <div className="sm:w-48">
          <select
            value={filters.city}
            onChange={(e) => updateField('city', e.target.value)}
            className="w-full text-xs sm:text-sm py-2.5 px-3 rounded-xl border border-entreo-border focus:outline-none focus:ring-1 focus:ring-entreo-red bg-white cursor-pointer"
          >
            <option value="">{lang === 'DE' ? 'Alle Städte' : 'All Cities'}</option>
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter Dropdown */}
        <div className="sm:w-44">
          <select
            value={filters.date}
            onChange={(e) => updateField('date', e.target.value)}
            className="w-full text-xs sm:text-sm py-2.5 px-3 rounded-xl border border-entreo-border focus:outline-none focus:ring-1 focus:ring-entreo-red bg-white cursor-pointer"
          >
            <option value="">{lang === 'DE' ? 'Beliebiges Datum' : 'Any Date'}</option>
            <option value="today">{lang === 'DE' ? 'Heute' : 'Today'}</option>
            <option value="this-weekend">{lang === 'DE' ? 'Dieses Wochenende' : 'This Weekend'}</option>
            <option value="next-weekend">{lang === 'DE' ? 'Nächstes Wochenende' : 'Next Weekend'}</option>
            <option value="this-month">{lang === 'DE' ? 'Diesen Monat' : 'This Month'}</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="sm:w-48 flex items-center gap-1.5">
          <ArrowUpDown className="w-4 h-4 text-entreo-muted shrink-0 hidden sm:block" />
          <select
            value={filters.sortBy}
            onChange={(e) => updateField('sortBy', e.target.value as FilterState['sortBy'])}
            className="w-full text-xs sm:text-sm py-2.5 px-3 rounded-xl border border-entreo-border focus:outline-none focus:ring-1 focus:ring-entreo-red bg-white cursor-pointer font-medium"
          >
            <option value="soonest">{lang === 'DE' ? 'Bald startend (Datum)' : 'Date: Soonest'}</option>
            <option value="price_asc">{lang === 'DE' ? 'Preis: Aufsteigend' : 'Price: Low to High'}</option>
            <option value="price_desc">{lang === 'DE' ? 'Preis: Absteigend' : 'Price: High to Low'}</option>
            <option value="relevance">{lang === 'DE' ? 'Kuratierte Relevanz' : 'Relevance'}</option>
          </select>
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive =
            cat.id === 'all'
              ? !filters.category || filters.category === 'all'
              : filters.category === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateField('category', cat.id === 'all' ? '' : cat.id)}
              className={`px-3 py-1.5 rounded-pill text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? 'bg-entreo-red text-white shadow-xs'
                  : 'bg-entreo-chip text-entreo-muted hover:text-entreo-ink hover:bg-entreo-chip-hover'
              }`}
            >
              {lang === 'DE' ? cat.labelDE : cat.labelEN}
            </button>
          );
        })}
      </div>

      {/* Secondary Bar: Max Price & Reset */}
      <div className="pt-2 border-t border-entreo-border/60 flex flex-wrap items-center justify-between gap-3 text-xs text-entreo-muted">
        <div className="flex items-center gap-3">
          <span>{lang === 'DE' ? 'Maximaler Preis:' : 'Max Price:'}</span>
          <input
            type="range"
            min="20"
            max="150"
            step="5"
            value={filters.maxPrice}
            onChange={(e) => updateField('maxPrice', Number(e.target.value))}
            className="w-32 accent-entreo-red cursor-pointer"
          />
          <span className="font-bold text-entreo-ink">
            {filters.maxPrice >= 150 ? 'Alle Preise' : `bis € ${filters.maxPrice}`}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-medium">
            {totalResults}{' '}
            {lang === 'DE'
              ? totalResults === 1
                ? 'Event gefunden'
                : 'Events gefunden'
              : totalResults === 1
              ? 'event found'
              : 'events found'}
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-entreo-red hover:underline font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{lang === 'DE' ? 'Filter zurücksetzen' : 'Reset filters'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

