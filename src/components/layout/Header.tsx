import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, PlusCircle, Ticket } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { translations } from '../../i18n/translations';
import { MobileDrawer } from './MobileDrawer';

export const Header: React.FC = () => {
  const { lang, setLang } = useStore();
  const t = translations[lang];
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-entreo-cream/90 backdrop-blur-md border-b border-entreo-border/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link
            to="/"
            className="font-serif text-2xl md:text-3xl font-extrabold tracking-tight text-entreo-red select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-entreo-red rounded"
            aria-label="ENTRÉO Homepage"
          >
            ENTRÉO
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              to="/events"
              className="text-sm font-medium text-entreo-ink hover:text-entreo-red transition-colors"
            >
              {t.nav.events}
            </Link>
            <Link
              to="/my-tickets"
              className="text-sm font-medium text-entreo-ink hover:text-entreo-red transition-colors"
            >
              {t.nav.myTickets}
            </Link>
            <Link
              to="/admin"
              className="text-sm font-medium text-entreo-muted hover:text-entreo-ink transition-colors"
            >
              {t.nav.admin}
            </Link>
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Desktop "Create an event" button */}
            <Link
              to="/organizer/create"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-pill bg-entreo-red hover:bg-entreo-red-hover text-white transition-all shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.nav.createEvent}</span>
            </Link>

            {/* Language Switcher DE | EN */}
            <div className="flex items-center text-xs font-semibold tracking-wide select-none">
              <button
                onClick={() => setLang('DE')}
                className={`transition-colors px-1 py-0.5 ${
                  lang === 'DE' ? 'text-entreo-ink font-bold' : 'text-entreo-muted/60 hover:text-entreo-ink'
                }`}
                aria-label="Deutsch"
              >
                DE
              </button>
              <span className="text-entreo-border-dark mx-0.5">|</span>
              <button
                onClick={() => setLang('EN')}
                className={`transition-colors px-1 py-0.5 ${
                  lang === 'EN' ? 'text-entreo-ink font-bold' : 'text-entreo-muted/60 hover:text-entreo-ink'
                }`}
                aria-label="English"
              >
                EN
              </button>
            </div>

            {/* Search Trigger Icon */}
            <button
              onClick={() => navigate('/events')}
              aria-label={t.nav.search}
              className="p-1.5 rounded-full text-entreo-ink hover:bg-entreo-chip transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-entreo-red"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Mobile Hamburger Menu Icon */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label={t.nav.menu}
              className="lg:hidden p-1.5 rounded-full text-entreo-ink hover:bg-entreo-chip transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-entreo-red"
            >
              <Menu className="w-6 h-6 stroke-[2]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Offcanvas Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

