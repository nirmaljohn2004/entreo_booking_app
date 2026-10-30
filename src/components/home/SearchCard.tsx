import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  ChevronDown,
  ArrowRight,
  X,
  Check,
  Globe2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { CITIES } from '../../data/cities';
import { useStore } from '../../store/useStore';
import { translations } from '../../i18n/translations';

interface DateOption {
  id: string;
  labelDE: string;
  labelEN: string;
  hintDE: string;
  hintEN: string;
}

const DATE_OPTIONS: DateOption[] = [
  {
    id: '',
    labelDE: 'Beliebiges Datum',
    labelEN: 'Any date',
    hintDE: 'Gesamten Spielplan durchsuchen',
    hintEN: 'Browse the entire live schedule',
  },
  {
    id: 'today',
    labelDE: 'Heute / Heute Abend',
    labelEN: 'Today / Tonight',
    hintDE: 'Spontane Ausgehtipps für heute',
    hintEN: 'Spontaneous plans for tonight',
  },
  {
    id: 'this-weekend',
    labelDE: 'Dieses Wochenende',
    labelEN: 'This Weekend',
    hintDE: 'Fr – So · Spitzenzeiten für Live-Kultur',
    hintEN: 'Fri – Sun · Peak live culture weekend',
  },
  {
    id: 'next-weekend',
    labelDE: 'Nächstes Wochenende',
    labelEN: 'Next Weekend',
    hintDE: 'Vorfreude & Wochenendplanung',
    hintEN: 'Plan your next weekend escape',
  },
  {
    id: 'this-month',
    labelDE: 'Diesen Monat',
    labelEN: 'This Month',
    hintDE: 'Alle Highlights des Monats',
    hintEN: 'All monthly featured stages',
  },
];

const CURATED_TRENDS = [
  { label: 'Berlin Techno', city: 'Berlin', query: 'Techno' },
  { label: 'Elbphilharmonie', city: 'Hamburg', query: 'Classical' },
  { label: 'Stand-up Comedy', city: 'Köln', query: 'Comedy' },
  { label: 'Neo-Classical', city: 'München', query: 'Neo-Classical' },
];

export const SearchCard: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useStore();
  const t = translations[lang];

  const [keyword, setKeyword] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(e.target as Node)
      ) {
        setIsCityOpen(false);
      }
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(e.target as Node)
      ) {
        setIsDateOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCityOpen(false);
        setIsDateOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCityOpen(false);
    setIsDateOpen(false);

    const params = new URLSearchParams();
    if (keyword.trim()) params.append('q', keyword.trim());
    if (selectedCity) params.append('city', selectedCity);
    if (selectedDate) params.append('date', selectedDate);

    navigate(`/events?${params.toString()}`);
  };

  const handleQuickTagClick = (tag: typeof CURATED_TRENDS[0]) => {
    setSelectedCity(tag.city);
    setKeyword(tag.query);
    const params = new URLSearchParams();
    params.append('city', tag.city);
    params.append('q', tag.query);
    navigate(`/events?${params.toString()}`);
  };

  const activeDateOption = DATE_OPTIONS.find((d) => d.id === selectedDate) || DATE_OPTIONS[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-10">
      <div className="max-w-xl mx-auto lg:max-w-3xl">
        {/* Main Search Elevation Container */}
        <form
          onSubmit={handleSearch}
          className="relative bg-white rounded-3xl p-3 sm:p-4 shadow-[0_12px_45px_rgba(20,20,20,0.08)] border border-neutral-200/90 transition-all hover:border-neutral-300"
          role="search"
          aria-label="Event search"
        >
          <div className="flex flex-col gap-2">
            {/* Field 1: Keyword Search */}
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-neutral-50/80 transition-colors focus-within:bg-neutral-50/90 focus-within:ring-1 focus-within:ring-entreo-red/30">
              <Search className="w-5 h-5 text-neutral-800 shrink-0 stroke-[2.2]" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t.search.keywordPlaceholder}
                className="w-full text-sm md:text-base text-entreo-ink placeholder:text-neutral-400 bg-transparent focus:outline-none"
                aria-label={t.search.keywordPlaceholder}
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  aria-label="Clear search"
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="h-px bg-neutral-100 mx-2" />

            {/* Row 2: Custom Interactive City & Date Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Field 2: Bespoke City Popover */}
              <div ref={cityDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsCityOpen(!isCityOpen);
                    setIsDateOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-2xl transition-all text-left text-sm md:text-base ${
                    isCityOpen
                      ? 'bg-neutral-100/90 ring-1 ring-entreo-red'
                      : 'hover:bg-neutral-50'
                  }`}
                  aria-expanded={isCityOpen}
                  aria-haspopup="listbox"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MapPin className="w-4 h-4 text-entreo-red shrink-0" />
                    <span className="font-medium text-entreo-ink truncate">
                      {selectedCity ? selectedCity : t.search.allCities}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-200 ${
                      isCityOpen ? 'rotate-180 text-entreo-red' : ''
                    }`}
                  />
                </button>

                {/* City Custom Dropdown Menu */}
                {isCityOpen && (
                  <div className="absolute top-full left-0 right-0 sm:right-auto sm:w-80 mt-2 z-50 bg-white rounded-2xl p-2 shadow-2xl border border-neutral-200/90 animate-in fade-in-0 zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      {lang === 'DE' ? 'Städte in Deutschland' : 'German Cultural Metropolises'}
                    </div>

                    {/* All Cities Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCity('');
                        setIsCityOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${
                        selectedCity === ''
                          ? 'bg-entreo-red/10 text-entreo-red font-semibold'
                          : 'hover:bg-neutral-50 text-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                          <Globe2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm block leading-tight font-medium">
                            {t.search.allCities}
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            {lang === 'DE' ? 'Bundesweit alle Events' : 'Nationwide events'}
                          </span>
                        </div>
                      </div>
                      {selectedCity === '' && <Check className="w-4 h-4 text-entreo-red" />}
                    </button>

                    <div className="h-px bg-neutral-100 my-1.5" />

                    {/* List of Specific Cities with Mini Visual & Event Count */}
                    <div className="max-h-64 overflow-y-auto space-y-0.5">
                      {CITIES.map((city) => {
                        const isSelected = selectedCity === city.name;
                        return (
                          <button
                            key={city.name}
                            type="button"
                            onClick={() => {
                              setSelectedCity(city.name);
                              setIsCityOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                              isSelected
                                ? 'bg-entreo-red/10 text-entreo-red font-semibold'
                                : 'hover:bg-neutral-50 text-neutral-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={city.image}
                                alt={city.name}
                                className="w-7 h-7 rounded-lg object-cover border border-neutral-200/80 shrink-0"
                              />
                              <div className="truncate">
                                <span className="font-serif text-sm block leading-tight truncate">
                                  {city.name}
                                </span>
                                <span className="text-[11px] text-neutral-400 block leading-none mt-0.5">
                                  {city.state}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                                {city.eventCount}
                              </span>
                              {isSelected && <Check className="w-4 h-4 text-entreo-red" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Field 3: Bespoke Date Popover */}
              <div ref={dateDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsDateOpen(!isDateOpen);
                    setIsCityOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-2xl transition-all text-left text-sm md:text-base ${
                    isDateOpen
                      ? 'bg-neutral-100/90 ring-1 ring-entreo-red'
                      : 'hover:bg-neutral-50'
                  }`}
                  aria-expanded={isDateOpen}
                  aria-haspopup="listbox"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Calendar className="w-4 h-4 text-entreo-red shrink-0" />
                    <span className="font-medium text-entreo-ink truncate">
                      {lang === 'DE' ? activeDateOption.labelDE : activeDateOption.labelEN}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-200 ${
                      isDateOpen ? 'rotate-180 text-entreo-red' : ''
                    }`}
                  />
                </button>

                {/* Date Custom Dropdown Menu */}
                {isDateOpen && (
                  <div className="absolute top-full left-0 right-0 sm:left-auto sm:right-0 sm:w-80 mt-2 z-50 bg-white rounded-2xl p-2 shadow-2xl border border-neutral-200/90 animate-in fade-in-0 zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      {lang === 'DE' ? 'Zeitraum wählen' : 'Select Timeframe'}
                    </div>

                    <div className="space-y-1">
                      {DATE_OPTIONS.map((opt) => {
                        const isSelected = selectedDate === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setSelectedDate(opt.id);
                              setIsDateOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${
                              isSelected
                                ? 'bg-entreo-red/10 text-entreo-red font-semibold'
                                : 'hover:bg-neutral-50 text-neutral-800'
                            }`}
                          >
                            <div>
                              <span className="text-sm block leading-tight font-medium">
                                {lang === 'DE' ? opt.labelDE : opt.labelEN}
                              </span>
                              <span className="text-[11px] text-neutral-400 block mt-0.5">
                                {lang === 'DE' ? opt.hintDE : opt.hintEN}
                              </span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-entreo-red shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search Submit CTA Button */}
            <button
              type="submit"
              className="mt-1 w-full bg-entreo-red hover:bg-entreo-red-hover text-white font-semibold text-sm md:text-base py-3 px-6 rounded-full flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-entreo-red focus-visible:ring-offset-2"
            >
              <span>{t.search.cta}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </form>

        {/* Popular Searches Pills matching reference */}
        <div className="mt-3.5 flex items-center justify-center flex-wrap gap-2 px-2 text-xs">
          <span className="text-neutral-500 font-medium mr-1">
            {lang === 'DE' ? 'Beliebte Suchen:' : 'Popular searches:'}
          </span>
          {['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt'].map((cityName) => {
            const displayCity = cityName === 'Munich' ? (lang === 'DE' ? 'München' : 'Munich') : cityName === 'Cologne' ? (lang === 'DE' ? 'Köln' : 'Cologne') : cityName;
            const queryCity = cityName === 'Munich' ? 'München' : cityName === 'Cologne' ? 'Köln' : cityName;
            return (
              <button
                key={cityName}
                type="button"
                onClick={() => {
                  setSelectedCity(queryCity);
                  navigate(`/events?city=${encodeURIComponent(queryCity)}`);
                }}
                className="px-3 py-1 rounded-full bg-neutral-100/80 hover:bg-white hover:border-entreo-red hover:text-entreo-red text-neutral-700 border border-neutral-200/60 transition-all font-medium text-[11px] sm:text-xs active:scale-95 shadow-2xs"
              >
                {displayCity}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

