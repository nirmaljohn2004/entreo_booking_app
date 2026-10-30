import React from 'react';
import { useStore } from '../../store/useStore';
import { translations } from '../../i18n/translations';

interface CookieBannerProps {
  onOpenSettings: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenSettings }) => {
  const { lang, consent, updateConsent } = useStore();
  const t = translations[lang];

  if (consent.hasConsented) return null;

  const handleAcceptAll = () => {
    updateConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleNecessaryOnly = () => {
    updateConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-5 bg-white/95 backdrop-blur-md border-t border-entreo-border shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-3xl space-y-1">
          <h4 className="font-serif font-bold text-sm md:text-base text-entreo-ink">
            {t.consent.title}
          </h4>
          <p className="text-xs text-entreo-muted leading-relaxed">
            {t.consent.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={onOpenSettings}
            className="text-xs font-semibold text-entreo-muted hover:text-entreo-ink px-3 py-2 rounded-pill hover:bg-entreo-chip transition-colors"
          >
            {t.consent.settings}
          </button>
          <button
            type="button"
            onClick={handleNecessaryOnly}
            className="text-xs font-semibold text-entreo-ink bg-entreo-chip hover:bg-entreo-chip-hover px-4 py-2 rounded-pill transition-colors flex-1 sm:flex-none"
          >
            {t.consent.necessaryOnly}
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="text-xs font-semibold text-white bg-entreo-red hover:bg-entreo-red-hover px-5 py-2 rounded-pill shadow-xs transition-colors flex-1 sm:flex-none"
          >
            {t.consent.acceptAll}
          </button>
        </div>
      </div>
    </div>
  );
};

