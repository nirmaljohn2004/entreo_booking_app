import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Music, 
  Drama, 
  PartyPopper, 
  Users, 
  Search, 
  MapPin, 
  Calendar, 
  ChevronDown, 
  ArrowRight, 
  Check, 
  Globe2,
  X
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { translations } from '../../i18n/translations';
import { CITIES } from '../../data/cities';

interface DateOption {
  id: string;
  labelDE: string;
  labelEN: string;
}

const DATE_OPTIONS: DateOption[] = [
  { id: '', labelDE: 'Beliebiges Datum', labelEN: 'Any date' },
  { id: 'today', labelDE: 'Heute Abend', labelEN: 'Today / Tonight' },
  { id: 'this-weekend', labelDE: 'Dieses Wochenende', labelEN: 'This Weekend' },
  { id: 'next-weekend', labelDE: 'Nächstes Wochenende', labelEN: 'Next Weekend' },
  { id: 'this-month', labelDE: 'Diesen Monat', labelEN: 'This Month' },
];

export const HeroSection: React.FC = () => {
  const { lang } = useStore();
  const t = translations[lang];
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('music');
  const [keyword, setKeyword] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setIsCityOpen(false);
      }
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target as Node)) {
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

  const categories = [
    { id: 'music', label: lang === 'DE' ? 'Musik' : 'Music', icon: Music, path: '/events?category=concert' },
    { id: 'theatre', label: lang === 'DE' ? 'Theater' : 'Theatre', icon: Drama, path: '/events?category=concert' },
    { id: 'comedy', label: lang === 'DE' ? 'Comedy' : 'Comedy', icon: PartyPopper, path: '/events?category=comedy' },
    { id: 'culture', label: lang === 'DE' ? 'Kultur' : 'Culture', icon: Users, path: '/events?category=clubbing' },
  ];

  const activeDateOption = DATE_OPTIONS.find((d) => d.id === selectedDate) || DATE_OPTIONS[0];

  return (
    <section className="relative w-full overflow-x-clip bg-white select-none pt-5 sm:pt-8 lg:pt-10 pb-8 sm:pb-12 flex flex-col justify-center">
      {/* Full-Bleed Panoramic Ambient Background with Concert Bokeh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="w-full h-full bg-cover bg-center opacity-20 mix-blend-multiply scale-105"
          style={{ backgroundImage: "url('/images/hero/hero-banner.jpg')" }}
        />
      </div>
      {/* Light Radial Gradient Overlays for High-Contrast Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 via-45% to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 via-transparent to-transparent pointer-events-none" />

      {/* Main Container calibrated to the 110% ideal visual scale */}
      <div className="max-w-[1380px] xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 w-full z-10 space-y-6 sm:space-y-8">
        
        {/* Top Row: Left Editorial Content + Right 3-Photo Overlapping Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center w-full">
          
          {/* Left Column: Eyebrow, Editorial Title, Subtitle, Category Filter Icons (6 cols) */}
          <div className="lg:col-span-6 z-10 space-y-4 sm:space-y-5">
            {/* Eyebrow with horizontal dash */}
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.24em] text-neutral-400">
                {lang === 'DE' ? "DEUTSCHLANDS EVENT-PLATTFORM" : "GERMANY'S EVENT PLATFORM"}
              </span>
              <span className="w-10 h-px bg-neutral-300" />
            </div>

            {/* Editorial Headline scaled +10% */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.85rem] xl:text-[4.35rem] text-entreo-ink font-bold tracking-tight leading-[1.04]">
              {t.hero.titlePart1}
              <br />
              <span className="italic text-entreo-red font-semibold">
                {t.hero.titlePart2}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-neutral-600 leading-relaxed max-w-lg">
              {t.hero.subtitle}
            </p>

            {/* Category Quick Shortcut Buttons scaled +10% */}
            <div className="flex items-center gap-7 sm:gap-9 pt-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      navigate(cat.path);
                    }}
                    className="group relative flex flex-col items-center gap-2 pb-2 text-center transition-all select-none focus:outline-none"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-entreo-red/10 text-entreo-red flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-neutral-800 group-hover:text-entreo-red transition-colors">
                      {cat.label}
                    </span>
                    {isActive && (
                      <span className="absolute -bottom-0.5 inset-x-0 h-0.5 bg-entreo-red rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: 3-Photo Overlapping Editorial Collage (+10% Substantial Sizing) */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center select-none py-2 lg:py-0">
            <div className="relative w-full max-w-[500px] sm:max-w-[540px] lg:max-w-[580px] h-[360px] sm:h-[410px] lg:h-[450px]">
              
              {/* Dynamic Red Ambient Glow behind cards */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-88 sm:w-104 h-40 bg-gradient-to-r from-entreo-red/70 via-[#F04235]/60 to-rose-500/70 rounded-3xl transform -rotate-45 blur-2xl opacity-50 pointer-events-none" />

              {/* Card 1 (Center-Left): Top Singer on Amber Stage */}
              <div className="absolute top-3 left-4 sm:left-8 z-20 w-52 sm:w-60 lg:w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform -rotate-2 transition-transform hover:rotate-0 duration-300">
                <img
                  src="/images/events/lea.png"
                  alt="Singer performing live on stage"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card 2 (Top Right): Berlin TV Tower Sunset */}
              <div className="absolute top-0 right-2 sm:right-6 z-15 w-48 sm:w-56 lg:w-60 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white transform rotate-3 transition-transform hover:rotate-1 duration-300">
                <img
                  src="/images/cities/berlin.png"
                  alt="Berlin TV tower at sunset"
                  className="w-full h-full object-cover brightness-[0.95]"
                />
                {/* Script annotation overlay on Berlin card */}
                <div className="absolute top-6 left-5 z-20 pointer-events-none">
                  <p className="font-script text-white text-base sm:text-xl font-bold leading-tight drop-shadow-md">
                    Live<br />Music<br />Real<br />Moments
                  </p>
                </div>
              </div>

              {/* Floating Script Callout Top-Right: Germany Events For Everyone */}
              <div className="absolute top-[-14px] right-[-8px] sm:right-[-12px] z-30 transform rotate-6 pointer-events-none">
                <div className="relative flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full shadow-sm border border-neutral-200/80">
                  <span className="font-script text-xs sm:text-sm lg:text-base font-bold text-neutral-900 leading-tight">
                    Germany Events For Everyone
                  </span>
                  <span className="text-entreo-red text-base lg:text-lg font-bold">⤹</span>
                </div>
              </div>

              {/* Card 3 (Bottom Right): Grand Opera House & Open-Air Crowd */}
              <div className="absolute bottom-1 right-1 sm:right-4 z-25 w-56 sm:w-64 lg:w-72 aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform -rotate-1 transition-transform hover:rotate-0 duration-300">
                <img
                  src="/images/categories/theatre.jpg"
                  alt="Grand classical theatre hall and live performance"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </div>

        </div>

        {/* Floating Integrated Search Pill Bar (+10% Scaled Width & Touch Target) */}
        <div className="w-full max-w-4xl lg:max-w-[940px] xl:max-w-[1000px] mx-auto relative z-30 pt-1">
          <form
            onSubmit={handleSearch}
            className="relative bg-white/95 backdrop-blur-md rounded-full p-2.5 sm:p-3 shadow-[0_18px_45px_rgba(0,0,0,0.11)] border border-neutral-200/90 flex flex-col md:flex-row items-center gap-2.5 transition-all hover:border-neutral-300"
            role="search"
            aria-label="Event search"
          >
            {/* Field 1: Keyword Search */}
            <div className="flex-1 flex items-center gap-3 px-4 py-1.5 w-full">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-500 shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t.search.keywordPlaceholder}
                className="w-full text-sm sm:text-base text-entreo-ink placeholder:text-neutral-400 bg-transparent focus:outline-none"
                aria-label={t.search.keywordPlaceholder}
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="h-7 w-px bg-neutral-200 hidden md:block shrink-0" />

            {/* Field 2: City Selector */}
            <div ref={cityDropdownRef} className="relative w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setIsCityOpen(!isCityOpen);
                  setIsDateOpen(false);
                }}
                className="flex items-center justify-between md:justify-start gap-2.5 px-4 py-2 rounded-full hover:bg-neutral-100/80 transition-all text-sm sm:text-base text-left w-full md:w-48"
                aria-expanded={isCityOpen}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-entreo-red shrink-0" />
                  <span className="font-medium text-entreo-ink truncate">
                    {selectedCity ? selectedCity : t.search.allCities}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform ${isCityOpen ? 'rotate-180 text-entreo-red' : ''}`} />
              </button>

              {/* City Dropdown Menu — High Z-Index, Never Clipped */}
              {isCityOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.22)] border border-neutral-200 w-80 animate-in fade-in-0 zoom-in-95 duration-150 ring-1 ring-black/5">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {lang === 'DE' ? 'Städte in Deutschland' : 'German Cities'}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCity('');
                      setIsCityOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm transition-colors ${
                      selectedCity === '' ? 'bg-entreo-red/10 text-entreo-red font-semibold' : 'hover:bg-neutral-50 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe2 className="w-4 h-4" />
                      <span>{t.search.allCities}</span>
                    </div>
                    {selectedCity === '' && <Check className="w-4 h-4 text-entreo-red" />}
                  </button>
                  <div className="h-px bg-neutral-100 my-1" />
                  <div className="max-h-60 overflow-y-auto space-y-0.5">
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
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm transition-colors ${
                            isSelected ? 'bg-entreo-red/10 text-entreo-red font-semibold' : 'hover:bg-neutral-50 text-neutral-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img src={city.image} alt={city.name} className="w-6 h-6 rounded-md object-cover border border-neutral-200/80 shrink-0" />
                            <span className="font-serif font-medium truncate">{city.name}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-entreo-red shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="h-7 w-px bg-neutral-200 hidden md:block shrink-0" />

            {/* Field 3: Date Selector */}
            <div ref={dateDropdownRef} className="relative w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setIsDateOpen(!isDateOpen);
                  setIsCityOpen(false);
                }}
                className="flex items-center justify-between md:justify-start gap-2.5 px-4 py-2 rounded-full hover:bg-neutral-100/80 transition-all text-sm sm:text-base text-left w-full md:w-44"
                aria-expanded={isDateOpen}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-entreo-red shrink-0" />
                  <span className="font-medium text-entreo-ink truncate">
                    {lang === 'DE' ? activeDateOption.labelDE : activeDateOption.labelEN}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform ${isDateOpen ? 'rotate-180 text-entreo-red' : ''}`} />
              </button>

              {/* Date Dropdown Menu — High Z-Index, Never Clipped */}
              {isDateOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.22)] border border-neutral-200 w-72 animate-in fade-in-0 zoom-in-95 duration-150 ring-1 ring-black/5">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {lang === 'DE' ? 'Zeitraum' : 'Timeframe'}
                  </div>
                  <div className="space-y-0.5">
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
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm transition-colors ${
                            isSelected ? 'bg-entreo-red/10 text-entreo-red font-semibold' : 'hover:bg-neutral-50 text-neutral-800'
                          }`}
                        >
                          <span>{lang === 'DE' ? opt.labelDE : opt.labelEN}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-entreo-red" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Search Button */}
            <button
              type="submit"
              className="w-full md:w-auto bg-entreo-red hover:bg-entreo-red-hover text-white font-semibold text-sm sm:text-base px-7 sm:px-8 py-3.5 rounded-full flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 shrink-0"
            >
              <span>{lang === 'DE' ? 'Events suchen' : 'Search Events'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};
