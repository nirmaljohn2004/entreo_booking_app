import React from 'react';
import { useStore } from '../../store/useStore';

export const ImpressumPage: React.FC = () => {
  const { lang } = useStore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-entreo-ink mb-6">
        {lang === 'DE' ? 'Impressum (§ 5 TMG)' : 'Legal Notice (Imprint)'}
      </h1>
      <div className="prose prose-sm text-entreo-muted space-y-4">
        <p className="font-semibold text-entreo-ink">
          ENTRÉO Live Experiences GmbH
        </p>
        <p>
          Torstraße 140<br />
          10119 Berlin<br />
          Deutschland
        </p>
        <p>
          <strong>Vertreten durch die Geschäftsführung:</strong><br />
          Maximilian von Steuben, Clara Becker
        </p>
        <p>
          <strong>Kontakt:</strong><br />
          E-Mail: kontakt@entreo.de<br />
          Telefon: +49 (0) 30 12345678
        </p>
        <p>
          <strong>Registereintrag:</strong><br />
          Eintragung im Handelsregister.<br />
          Registergericht: Amtsgericht Charlottenburg (Berlin)<br />
          Registernummer: HRB 249811 B
        </p>
        <p>
          <strong>Umsatzsteuer-Identifikationsnummer (§ 27 a UStG):</strong><br />
          DE 349 281 902
        </p>
        <p>
          <strong>EU-Streitschlichtung:</strong><br />
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
          https://ec.europa.eu/consumers/odr/. Wir sind nicht verpflichtet oder bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </div>
    </div>
  );
};

