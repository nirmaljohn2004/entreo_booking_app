import React from 'react';
import { useStore } from '../../store/useStore';

export const DatenschutzPage: React.FC = () => {
  const { lang } = useStore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-entreo-ink mb-6">
        {lang === 'DE' ? 'Datenschutzerklärung (DSGVO)' : 'Privacy Policy (GDPR)'}
      </h1>
      <div className="text-xs md:text-sm text-entreo-muted space-y-4 leading-relaxed">
        <h2 className="text-base font-bold text-entreo-ink">1. Datenschutz auf einen Blick</h2>
        <p>
          Der Schutz Ihrer persönlichen Daten ist uns ein zentrales Anliegen. Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen.
        </p>

        <h2 className="text-base font-bold text-entreo-ink">2. Verantwortliche Stelle</h2>
        <p>
          ENTRÉO Live Experiences GmbH, Torstraße 140, 10119 Berlin.<br />
          E-Mail: datenschutz@entreo.de
        </p>

        <h2 className="text-base font-bold text-entreo-ink">3. Ticketbuchung und Zahlungsdaten</h2>
        <p>
          Im Rahmen dieses interaktiven Design-Prototyps werden <strong>keine echten Zahlungsdaten</strong>, Kreditkartennummern oder Bankdaten erfasst oder an Dritte übertragen. Sämtliche Buchungsvorgänge und Bestätigungen basieren auf simulierten Beispieldaten in Ihrem lokalen Browser (LocalStorage).
        </p>

        <h2 className="text-base font-bold text-entreo-ink">4. Cookies & Meta Pixel Architektur</h2>
        <p>
          Wir setzen ein DSGVO-konformes Consent-Management ein. Das simulierte Meta Pixel wird nur und ausschließlich dann initialisiert, wenn Sie der Kategorie „Marketing & Kampagnen“ ausdrücklich zugestimmt haben. Ein Widerruf ist jederzeit über die Cookie-Einstellungen im Footer möglich.
        </p>
      </div>
    </div>
  );
};

