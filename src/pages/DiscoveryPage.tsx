import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarX } from 'lucide-react';
import { useStore } from '../store/useStore';
import { EventFilters, FilterState } from '../components/events/EventFilters';
import { EventCard } from '../components/events/EventCard';
import { EventSkeleton } from '../components/events/EventSkeleton';

export const DiscoveryPage: React.FC = () => {
  const { events, lang } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize filters from searchParams
  const [filters, setFilters] = useState<FilterState>({
    keyword: searchParams.get('q') || '',
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    date: searchParams.get('date') || '',
    maxPrice: Number(searchParams.get('maxPrice')) || 150,
    sortBy: (searchParams.get('sort') as FilterState['sortBy']) || 'soonest',
  });

  // Sync state to URL params
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.keyword) params.set('q', newFilters.keyword);
    if (newFilters.city) params.set('city', newFilters.city);
    if (newFilters.category && newFilters.category !== 'all') params.set('category', newFilters.category);
    if (newFilters.date) params.set('date', newFilters.date);
    if (newFilters.maxPrice < 150) params.set('maxPrice', String(newFilters.maxPrice));
    if (newFilters.sortBy !== 'soonest') params.set('sort', newFilters.sortBy);
    setSearchParams(params, { replace: true });
  };

  const handleResetFilters = () => {
    const emptyFilters: FilterState = {
      keyword: '',
      city: '',
      category: '',
      date: '',
      maxPrice: 150,
      sortBy: 'soonest',
    };
    setFilters(emptyFilters);
    setSearchParams({});
  };

  // Filter & sort logic
  const filteredEvents = useMemo(() => {
    return events
      .filter((e) => e.status === 'published')
      .filter((e) => {
        // Keyword
        if (filters.keyword.trim()) {
          const q = filters.keyword.toLowerCase();
          const matchTitle = e.title.toLowerCase().includes(q);
          const matchVenue = e.venue.name.toLowerCase().includes(q);
          const matchGenre = e.genreTags.some((tag) => tag.toLowerCase().includes(q));
          if (!matchTitle && !matchVenue && !matchGenre) return false;
        }

        // City
        if (filters.city && e.city !== filters.city) {
          return false;
        }

        // Category
        if (filters.category && filters.category !== 'all' && e.category !== filters.category) {
          return false;
        }

        // Max price
        if (filters.maxPrice < 150 && e.minPrice > filters.maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'soonest') {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
        if (filters.sortBy === 'price_asc') {
          return a.minPrice - b.minPrice;
        }
        if (filters.sortBy === 'price_desc') {
          return b.minPrice - a.minPrice;
        }
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [events, filters]);

  // Simulate short realistic filter latency
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [filters.city, filters.category, filters.sortBy]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-entreo-red mb-1">
          {lang === 'DE' ? 'LIVE-KALENDER DEUTSCHLAND' : 'LIVE CALENDAR GERMANY'}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-entreo-ink font-bold tracking-tight">
          {lang === 'DE' ? (
            <>
              Entdecke ausgewählte Events in <span className="italic text-entreo-red">Deutschland</span>
            </>
          ) : (
            <>
              Explore curated events across <span className="italic text-entreo-red">Germany</span>
            </>
          )}
        </h1>
        <p className="text-xs sm:text-sm text-entreo-muted mt-1 max-w-xl">
          {lang === 'DE'
            ? 'Alle Konzerte, Clubs, Stand-up Shows und Theaterabende mit Direktbuchung in Europe/Berlin Zeitzone.'
            : 'Concerts, underground clubs, comedy tours and performances. Guaranteed authentic booking in Europe/Berlin timezone.'}
        </p>
      </div>

      {/* Filter Bar */}
      <EventFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={filteredEvents.length}
      />

      {/* Results Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventSkeleton />
          <EventSkeleton />
          <EventSkeleton />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-entreo-border p-8 max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-entreo-chip flex items-center justify-center mx-auto text-entreo-muted">
            <CalendarX className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-entreo-ink">
            {lang === 'DE' ? 'Keine passenden Events gefunden' : 'No matching events found'}
          </h3>
          <p className="text-xs text-entreo-muted max-w-sm mx-auto leading-relaxed">
            {lang === 'DE'
              ? 'Für Ihre aktuellen Filterkriterien gibt es im Moment keine Veranstaltungen. Versuchen Sie es mit einer anderen Stadt oder setzen Sie die Filter zurück.'
              : 'There are currently no events matching your criteria. Try adjusting your city or budget filters.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold px-4 py-2 rounded-pill bg-entreo-red text-white hover:bg-entreo-red-hover transition-colors"
            >
              {lang === 'DE' ? 'Alle Filter zurücksetzen' : 'Reset all filters'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </main>
  );
};

