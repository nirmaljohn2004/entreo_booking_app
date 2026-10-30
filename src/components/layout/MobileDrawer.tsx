import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Calendar, PlusCircle, Ticket, ShieldCheck, HelpCircle, Heart } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { translations } from '../../i18n/translations';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { lang, setLang } = useStore();
  const t = translations[lang];
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-sm bg-entreo-cream h-full shadow-2xl flex flex-col p-6 z-10 overflow-y-auto">
        {/* Top row */}
        <div className="flex items-center justify-between pb-6 border-b border-entreo-border">
          <Link
            to="/"
            onClick={onClose}
            className="font-serif text-2xl font-bold tracking-tight text-entreo-red"
          >
            ENTRÉO
          </Link>
          <button
            onClick={onClose}
            aria-label={t.nav.close}
            className="p-2 rounded-full hover:bg-entreo-chip text-entreo-ink transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 py-6 space-y-2">
          <Link
            to="/events"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-entreo-ink hover:bg-entreo-chip transition-colors"
          >
            <Calendar className="w-5 h-5 text-entreo-red" />
            <span>{t.nav.events}</span>
          </Link>

          <Link
            to="/my-tickets"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-entreo-ink hover:bg-entreo-chip transition-colors"
          >
            <Ticket className="w-5 h-5 text-entreo-red" />
            <span>{t.nav.myTickets}</span>
          </Link>

          <Link
            to="/organizer/create"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-semibold text-entreo-red bg-entreo-red-light hover:bg-entreo-red/15 transition-colors"
          >
            <PlusCircle className="w-5 h-5 text-entreo-red" />
            <span>{t.nav.createEvent}</span>
          </Link>

          <Link
            to="/admin"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-entreo-ink hover:bg-entreo-chip transition-colors"
          >
            <ShieldCheck className="w-5 h-5 text-entreo-muted" />
            <span>{t.nav.admin}</span>
          </Link>
        </nav>

        {/* Bottom Language & Info */}
        <div className="pt-6 border-t border-entreo-border space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-entreo-muted font-bold">
              Language / Sprache
            </span>
            <div className="flex items-center text-sm font-semibold tracking-wider bg-white rounded-pill p-1 border border-entreo-border">
              <button
                onClick={() => setLang('DE')}
                className={`px-3 py-1 rounded-pill transition-colors ${
                  lang === 'DE' ? 'bg-entreo-red text-white' : 'text-entreo-muted hover:text-entreo-ink'
                }`}
              >
                DE
              </button>
              <button
                onClick={() => setLang('EN')}
                className={`px-3 py-1 rounded-pill transition-colors ${
                  lang === 'EN' ? 'bg-entreo-red text-white' : 'text-entreo-muted hover:text-entreo-ink'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="text-[11px] text-entreo-muted space-y-1">
            <p>Every event, taken care of.</p>
            <p className="text-entreo-muted/80">Premium event booking platform for Germany.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

