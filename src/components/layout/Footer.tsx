import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { translations } from '../../i18n/translations';
import { CITIES } from '../../data/cities';

interface FooterProps {
  onOpenCookieSettings?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCookieSettings }) => {
  const { lang } = useStore();
  const t = translations[lang];

  return (
    <footer className="bg-entreo-cream border-t border-entreo-border mt-16 pt-12 pb-24 lg:pb-16 text-entreo-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Positioning */}
          <div className="md:col-span-1 space-y-3">
            <Link
              to="/"
              className="font-serif text-2xl font-bold tracking-tight text-entreo-red select-none inline-block"
            >
              ENTRÉO
            </Link>
            <p className="text-xs text-entreo-muted leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="pt-2 text-[11px] font-semibold text-entreo-muted">
              <span>Berlin • Hamburg • München • Köln • Frankfurt • Düsseldorf</span>
            </div>
          </div>

          {/* Col 2: Explore Cities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-entreo-red mb-3">
              {t.footer.explore}
            </h4>
            <ul className="space-y-2 text-xs text-entreo-muted">
              {CITIES.map((c) => (
                <li key={c.name}>
                  <Link
                    to={`/events?city=${encodeURIComponent(c.name)}`}
                    className="hover:text-entreo-red transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Organizers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-entreo-red mb-3">
              {t.footer.organizersTitle}
            </h4>
            <ul className="space-y-2 text-xs text-entreo-muted">
              <li>
                <Link
                  to="/organizer/create"
                  className="font-semibold text-entreo-red hover:underline"
                >
                  {t.nav.createEvent}
                </Link>
              </li>
              <li>
                <Link to="/organizer" className="hover:text-entreo-red transition-colors">
                  {lang === 'DE' ? 'Produktions-Services' : 'Production Services'}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-entreo-red transition-colors">
                  {t.nav.admin}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-entreo-red mb-3">
              {t.footer.legalTitle}
            </h4>
            <ul className="space-y-2 text-xs text-entreo-muted">
              <li>
                <Link to="/impressum" className="hover:text-entreo-red transition-colors">
                  {t.footer.impressum} (§ 5 TMG)
                </Link>
              </li>
              <li>
                <Link to="/datenschutz" className="hover:text-entreo-red transition-colors">
                  {t.footer.datenschutz} (DSGVO)
                </Link>
              </li>
              <li>
                <Link to="/agb" className="hover:text-entreo-red transition-colors">
                  {t.footer.agb}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenCookieSettings}
                  className="hover:text-entreo-red transition-colors underline text-left"
                >
                  {t.footer.cookies}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-entreo-border/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-entreo-muted gap-3">
          <p>© {new Date().getFullYear()} ENTRÉO GmbH. {t.footer.rights}</p>
          <div className="flex items-center gap-4">
            <span>Europe/Berlin Timezone (CET/CEST)</span>
            <span>Preise inkl. 19% MwSt.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

