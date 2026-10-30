import React, { useState } from 'react';
import { X, ShieldCheck, Check } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { translations } from '../../i18n/translations';

interface CookieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CookieSettingsModal: React.FC<CookieSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang, consent, updateConsent } = useStore();
  const t = translations[lang];

  const [analytics, setAnalytics] = useState(consent.analytics);
  const [marketing, setMarketing] = useState(consent.marketing);

  if (!isOpen) return null;

  const handleSave = () => {
    updateConsent({
      necessary: true,
      analytics,
      marketing,
    });
    onClose();
  };

  const handleAcceptAll = () => {
    updateConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-entreo-cream rounded-2xl shadow-2xl border border-entreo-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-entreo-border bg-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-entreo-red" />
            <h3 className="font-serif text-lg font-bold text-entreo-ink">
              {t.consent.settings}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-entreo-muted hover:text-entreo-ink hover:bg-entreo-chip transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <p className="text-xs text-entreo-muted leading-relaxed">
            {t.consent.description}
          </p>

          {/* Necessary */}
          <div className="p-3.5 bg-white rounded-xl border border-entreo-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-entreo-ink">
                {t.consent.necessary}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {lang === 'DE' ? 'Immer aktiv' : 'Always Active'}
              </span>
            </div>
            <p className="text-[11px] text-entreo-muted leading-relaxed">
              {t.consent.necessaryDesc}
            </p>
          </div>

          {/* Analytics */}
          <div className="p-3.5 bg-white rounded-xl border border-entreo-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-entreo-ink">
                {t.consent.analytics}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-entreo-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-entreo-red"></div>
              </label>
            </div>
            <p className="text-[11px] text-entreo-muted leading-relaxed">
              {t.consent.analyticsDesc}
            </p>
          </div>

          {/* Marketing (Meta Pixel Mock) */}
          <div className="p-3.5 bg-white rounded-xl border border-entreo-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-entreo-ink">
                {t.consent.marketing}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-entreo-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-entreo-red"></div>
              </label>
            </div>
            <p className="text-[11px] text-entreo-muted leading-relaxed">
              {t.consent.marketingDesc}
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-white border-t border-entreo-border flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleAcceptAll}
            className="text-xs font-semibold text-entreo-red hover:underline"
          >
            {t.consent.acceptAll}
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-entreo-muted hover:text-entreo-ink"
            >
              {lang === 'DE' ? 'Abbrechen' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-entreo-red hover:bg-entreo-red-hover text-white text-xs font-semibold rounded-pill transition-all"
            >
              {t.consent.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

