import React from 'react';
import { useStore } from '../../store/useStore';

export const AgbPage: React.FC = () => {
  const { lang } = useStore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold text-entreo-ink mb-6">
        {lang === 'DE' ? 'Allgemeine Geschäftsbedingungen (AGB)' : 'Terms of Service (AGB)'}
      </h1>
      <div className="text-xs md:text-sm text-entreo-muted space-y-4 leading-relaxed">
        <h2 className="text-base font-bold text-entreo-ink">§ 1 Geltungsbereich und Vermittlerrolle</h2>
        <p>
          ENTRÉO vermittelt im Auftrag der jeweiligen Veranstalter Eintrittskarten für Konzerte, Festivals, Kultur- und Comedy-Veranstaltungen. Der Vertrag über den Veranstaltungsbesuch kommt unmittelbar zwischen dem Ticketkäufer und dem jeweiligen Veranstalter zustande.
        </p>

        <h2 className="text-base font-bold text-entreo-ink">§ 2 Preise und Gebühren</h2>
        <p>
          Alle angegebenen Preise verstehen sich in Euro (€) inklusive der gesetzlichen deutschen Mehrwertsteuer (derzeit 19% bzw. 7% für kulturelle Darbietungen). Transparente Buchungsgebühren werden im Warenkorb vor Abschluss gesondert ausgewiesen.
        </p>

        <h2 className="text-base font-bold text-entreo-ink">§ 3 Widerrufsbelehrung bei Freizeitveranstaltungen</h2>
        <p>
          Gemäß § 312g Abs. 2 Nr. 9 BGB besteht bei Verträgen zur Erbringung von Dienstleistungen im Zusammenhang mit Freizeitbetätigungen, für die ein spezifischer Termin oder Zeitraum vorgesehen ist, <strong>kein gesetzliches Widerrufsrecht</strong>.
        </p>
      </div>
    </div>
  );
};

